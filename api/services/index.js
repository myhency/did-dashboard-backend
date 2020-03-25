import express from 'express';
import Role from '../../enums/Role';
import { validationResult, param, query, body } from 'express-validator';
import Log from '../../db/models/Log';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import Instance from '../../db/models/Instance';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import { Sequelize, Op } from 'sequelize';
import { format, parse, startOfToday, startOfDay, endOfDay, startOfHour, subHours } from 'date-fns';
import Constants from '../../constants';
import pagingMiddleware from '../../common/middleware/pagingMiddleware';
import _ from 'lodash';
const router = express.Router();

router.get('/', [
    query('siteId').isInt({ min: 1 }).toInt().optional(),
    query('role').isString().isIn([Role.ISSUER, Role.VERIFIER, Role.VERISSUER]).optional(),
    query('openDateStart').matches(Constants.DATE_FORMAT_REGEX).optional(),
    query('openDateEnd').matches(Constants.DATE_FORMAT_REGEX).custom((openDateEnd, { req }) => {
        if (openDateEnd < req.query.openDateStart) {
            throw new Error();
        } else {
            return openDateEnd;
        }
    }).optional(),
    pagingMiddleware(Constants.PER_PAGE, ['name', 'role', 'numberOfInstances', 'openDate', 'endpoint', 'siteName'])
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { perPage, page, sort, offset, limit } = req.paging;
    const { siteId, role, openDateStart, openDateEnd } = req.query;

    const whereClause = {};
    if (siteId !== undefined) {
        whereClause.siteId = siteId
    }
    if (role !== undefined) {
        whereClause.role = role
    }
    if (openDateStart !== undefined) {
        whereClause.openDate = {
            [Op.gte]: startOfDay(parse(openDateStart, Constants.DATE_FORMAT, new Date()))
        };
    }
    if (openDateEnd !== undefined) {
        whereClause.openDate = {
            [Op.lte]: endOfDay(parse(openDateEnd, Constants.DATE_FORMAT, new Date()))
        };
    }
    if (openDateStart !== undefined && openDateEnd !== undefined) {
        whereClause.openDate = {
            [Op.between]: [
                startOfDay(parse(openDateStart, Constants.DATE_FORMAT, new Date())),
                endOfDay(parse(openDateEnd, Constants.DATE_FORMAT, new Date()))
            ]
        };
    }

    let orderClause = [ 
        ['name', 'asc']
    ];
    if(sort.length > 0) {
        orderClause = sort.map(s => {
            switch (s.key) {
                case 'numberOfInstances':
                    return [Sequelize.literal('(SELECT COUNT(instance.service_id) FROM instance WHERE instance.service_id = service.id)'), s.value];
                case 'siteName':
                    return [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = service.site_id)'), s.value];
                default:
                    return [s.key, s.value];
            }
        });
    }

    let services;

    try {
        services = await Service.findAndCountAll({
            raw: true,
            attributes: [
                'id',
                'name',
                'role',
                'openDate',
                'endpoint',
                'siteId',
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = service.site_id)'), 'siteName'],
                [Sequelize.literal('(SELECT COUNT(instance.service_id) FROM instance WHERE instance.service_id = service.id)'), 'numberOfInstances']
            ],
            where: whereClause,
            order: orderClause,
            offset: offset,
            limit: limit,
        });
    } catch (err) {
        next(err);
        return;
    }

    services.rows.forEach(row => {
        row.openDate = format(row.openDate, Constants.DATE_FORMAT);
    })

    res.json({
        result: services.rows,

        perPage,
        page,
        sort,
        totalPage: Math.ceil(services.count / perPage),
        totalCount: services.count
    });
});

router.get('/count', async (req, res, next) => {

    let count;

    try {
        count = await Service.count();
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: count
    })
});

router.get('/:id', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let service;

    try {
        service = await Service.findOne({
            raw: true,
            attributes: [
                'id',
                'name',
                'role',
                'openDate',
                'endpoint',
                'siteId',
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = service.site_id)'), 'siteName'],
            ],
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (!service) {
        return res.status(404).send();
    }

    
    service.openDate = format(service.openDate, Constants.DATE_FORMAT);

    res.json({
        result: service
    })
});

router.get('/:id/statistic', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let service;

    try {
        service = await Service.findOne({
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (!service) {
        return res.status(404).send();
    }

    let cumulativeInfoLogs;
    let todayInfoLogs;

    try {
        cumulativeInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [Sequelize.fn('count', 'logName'), 'count']
            ],
            where: {
                serviceId: id,
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.NEW_PAIRWISEDID_INFO,
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: 'logName'
        });
    } catch (err) {
        next(err);
        return;
    }

    try {
        todayInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [Sequelize.fn('count', 'logName'), 'count']
            ],
            where: {
                serviceId: id,
                occurredDate: {
                    [Op.gte]: startOfToday()
                },
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.NEW_PAIRWISEDID_INFO,
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: 'logName'
        });
    } catch (err) {
        next(err);
        return;
    }

    const cumulativeInfosLogsJson = cumulativeInfoLogs.reduce((acc, element) => {
        acc[element.logName] = element.count;
        return acc;
    }, {
        NEW_PAIRWISEDID_INFO: 0,
        CREDENTIAL_ISSUANCE_INFO: 0,
        CREDENTIAL_VERIFICATION_INFO: 0
    });

    const cumulativePairwisedid = cumulativeInfosLogsJson[LogName.INFO.NEW_PAIRWISEDID_INFO]
    const cumulativeCredentialIssuance = cumulativeInfosLogsJson[LogName.INFO.CREDENTIAL_ISSUANCE_INFO];
    const cumulativeCredentialVerification = cumulativeInfosLogsJson[LogName.INFO.CREDENTIAL_VERIFICATION_INFO];


    const todayInfoLogsJson = todayInfoLogs.reduce((acc, element) => {
        acc[element.logName] = element.count;
        return acc;
    }, {
        NEW_PAIRWISEDID_INFO: 0,
        CREDENTIAL_ISSUANCE_INFO: 0,
        CREDENTIAL_VERIFICATION_INFO: 0
    });

    const todayPairwisedid = todayInfoLogsJson[LogName.INFO.NEW_PAIRWISEDID_INFO]
    const todayCredentialIssuance = todayInfoLogsJson[LogName.INFO.CREDENTIAL_ISSUANCE_INFO];
    const todayCredentialVerification = todayInfoLogsJson[LogName.INFO.CREDENTIAL_VERIFICATION_INFO];



    res.json({
        result: {
            cumulativePairwisedid,
            cumulativeCredentialIssuance,
            cumulativeCredentialVerification,
            todayPairwisedid,
            todayCredentialIssuance,
            todayCredentialVerification
        }
    });
});


router.get('/:id/transition', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let service;

    try {
        service = await Service.findOne({
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (!service) {
        return res.status(404).send();
    }

    const now = new Date();
    const timetable = _.range(23, -1).map(i => {
        return {
            date: format(startOfHour(subHours(now, i)), Constants.DATETIME_FORMAT),
            issuance: 0,
            verification: 0
        }
    });

    let recentInfoLogs;

    try {
        recentInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                [ Sequelize.fn('DATE_FORMAT', Sequelize.col('occurred_date'), '%Y-%m-%d %H:00'), 'occurredDate' ],
                'logName',
            ],
            where: {
                serviceId: id,
                occurredDate: {
                    [Op.gte]: startOfHour(subHours(now, 23))
                },
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: [
                Sequelize.fn('DATE_FORMAT', Sequelize.col('occurred_date'), '%Y-%m-%d %H:00'),
                'logName'
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    recentInfoLogs.forEach(info => {
        const index = timetable.findIndex(e => e.date === info.occurredDate);
        if (index && info.logName === LogName.INFO.CREDENTIAL_ISSUANCE_INFO)
            timetable[index].issuance += 1;
        if (index && info.logName === LogName.INFO.CREDENTIAL_VERIFICATION_INFO)
            timetable[index].verification += 1;
    });

    res.json({
        result: timetable
    })
});

router.delete('/:id', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let instanceCount;

    try {
        instanceCount = await Instance.count({
            where: {
                serviceId: id
            }
        });
    } catch(err) {
        next(err);
        return;
    }

    if(instanceCount > 0) {
        return res.status(409).send();
    }

    let deletedCount;

    try {
        deletedCount = await Service.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (deletedCount === 0) {
        return res.status(404).send();
    }

    return res.status(204).send();
});

router.post('/', [
    body('siteId').isInt({ min: 1 }).toInt(),
    body('name').isString().trim().notEmpty(),
    body('role').isIn(Object.values(Role).map(role => role)),
    body('openDate').matches(Constants.DATE_FORMAT_REGEX),
    body('endpoint').isString().trim().notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { siteId, name, role, openDate, endpoint } = req.body;

    let siteCount; 

    try {
        siteCount = await Site.count({
            where: {
                id: siteId
            }
        });
    } catch(err) {
        next(err);
        return;
    }

    // 존재하지 않는 사이트라면 400을 리턴한다.
    if(siteCount === 0) {
        return res.status(400).send();    
    }

    let service;

    try {
        service = await Service.create({
            name,
            role,
            openDate: parse(openDate, Constants.DATE_FORMAT, new Date()),
            endpoint,
            siteId
        });
    } catch(err) {
        next(err);
        return;
    }

    return res.status(201).send({
        result: {
            id: service.id
        }
    });
});

router.put('/:id', [
    param('id').isInt({ min: 1 }).toInt(),

    body('name').isString().trim().notEmpty(),
    body('role').isIn(Object.values(Role).map(role => role)),
    body('openDate').matches(Constants.DATE_FORMAT_REGEX),
    body('endpoint').isString().trim().notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;
    const { name, role, openDate, endpoint } = req.body;

    let service; 

    try {
        service = await Service.findOne({
            where: {
                id: id
            }
        });
    } catch(err) {
        next(err);
        return;
    }

    if(!service) {
        return res.status(404).send();    
    }

    try {
        service.name = name;
        service.role = role;
        service.openDate = parse(openDate, Constants.DATE_FORMAT, new Date());
        service.endpoint = endpoint;

        service = await service.save();
    } catch(err) {
        next(err);
        return;
    }

    return res.status(201).send({
        result: {
            id: service.id
        }
    });
});

module.exports = router;