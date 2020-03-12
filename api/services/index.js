import express from 'express';
import Role from '../../enums/Role';
import { validationResult, param, query } from 'express-validator';
import Log from '../../db/models/Log';
import Service from '../../db/models/Service';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import { Sequelize, Op } from 'sequelize';
import { format, parse, startOfToday, startOfDay, endOfDay, startOfHour, subHours } from 'date-fns';
import Constants from '../../constants';
import _ from 'lodash';
const router = express.Router();

router.get('/', [
    query('siteId').isNumeric().toInt().optional(),
    query('role').isString().isIn([Role.ISSUER, Role.VERIFIER, Role.VERISSUER]).optional(),
    query('openDateStart').matches(Constants.DATE_FORMAT_REGEX).optional(),
    query('openDateEnd').matches(Constants.DATE_FORMAT_REGEX).custom((openDateEnd, { req }) => {
        if (openDateEnd < req.query.openDateStart) {
            throw new Error();
        } else {
            return openDateEnd;
        }
    }).optional(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { siteId, role, openDateStart, openDateEnd } = req.query;

    const whereClause = {};
    if(siteId !== undefined) {
        whereClause.siteId = siteId
    }
    if(role !== undefined) {
        whereClause.role = role
    }
    if(openDateStart !== undefined) {
        whereClause.openDate = {
            [Op.gte]: startOfDay(parse(openDateStart, Constants.DATE_FORMAT, new Date()))
        };
    }
    if(openDateEnd !== undefined) {
        whereClause.openDate = {
            [Op.gte]: endOfDay(parse(openDateEnd, Constants.DATE_FORMAT, new Date()))
        };
    }
    if(openDateStart !== undefined && openDateEnd !== undefined) {
        whereClause.openDate = {
            [Op.between]: [
                startOfDay(parse(openDateStart, Constants.DATE_FORMAT, new Date())),
                endOfDay(parse(openDateEnd, Constants.DATE_FORMAT, new Date()))
            ]
        };
    }

    let services;

    try {
        services = await Service.findAll({
            raw: true,
            attributes: [
                'id',
                'name',
                'role',
                [ Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d'), 'openDate' ],
                'endpoint',
                'siteId',
                [ Sequelize.literal('(SELECT site.name FROM site WHERE site.id = service.site_id)'),  'siteName' ],
                [ Sequelize.literal('(SELECT COUNT(instance.service_id) FROM instance WHERE instance.service_id = service.id)'),  'numberOfInstances' ]
            ],
            where: whereClause
        });
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: services
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
    param('id').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
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
                [ Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d'), 'openDate' ],
                'endpoint',
                'siteId',
                [ Sequelize.literal('(SELECT site.name FROM site WHERE site.id = service.site_id)'),  'siteName' ],
            ],
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if(!service) {
        return res.status(404).send();
    }

    res.json({
        result: service
    })
});

router.get('/:id/statistic', [
    param('id').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
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

    if(!service) {
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
                timestamp: {
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
    param('id').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
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

    if(!service) {
        return res.status(404).send();
    }
    
    const now = new Date();
    const timetable = _.range(23, -1).map(i => {
        return {
            timestamp: format(startOfHour(subHours(now, i)), Constants.DATETIME_FORMAT),
            issuance: 0,
            verification: 0
        }
    });

    let recentInfoLogs;

    try {
        recentInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d %H:00')
                    , 'timestamp'
                ]
            ],
            where: {
                serviceId: id,
                timestamp: {
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
                Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d %H:00'),
                'logName'
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    recentInfoLogs.forEach(info => {
        const index = timetable.findIndex(e => e.timestamp === info.timestamp);
        if(index && info.logName === LogName.INFO.CREDENTIAL_ISSUANCE_INFO)
            timetable[index].issuance += 1;
        if(index && info.logName === LogName.INFO.CREDENTIAL_VERIFICATION_INFO)
            timetable[index].verification += 1;
    });

    res.json({
        result: timetable
    })
});

module.exports = router;