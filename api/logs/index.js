import express from 'express';
import { Op, Sequelize } from 'sequelize';
import Log from '../../db/models/Log';
import { validationResult, query } from 'express-validator';
import { format, subMinutes, parse } from 'date-fns';
import _ from 'lodash';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import Constants from '../../constants';
import should from 'should';
import pagingMiddleware from '../../common/middleware/pagingMiddleware';
const router = express.Router();

router.get('/error/count', async (req, res, next) => {
    let count;

    // try {
    //     count = await Log.count({
    //         where: {
    //             logLevel: LogLevel.ERROR,
    //             occurredDate: {
    //                 [Op.gte]: subMinutes(new Date(), 60)
    //             }
    //         }
    //     });
    // } catch (err) {
    //     next(err);
    //     return;
    // }

    count = Math.floor(Math.random() * (5 - 0 + 1)) + 0

    res.json({
        result: count
    })
});
/*
router.get('/info/apicall/transition', async (req, res, next) => {
    
    const now = new Date();
    const timetable = _.range(59, -1).map(i => {
        return {
            date: format(subMinutes(now, i), Constants.TIME_FORMAT),
            count: 0
        }
    });
    
    let apicalls;

    try {
        apicalls = await Log.findAll({
            raw: true,
            attributes: [
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('occurred_date'), '%H:%i')
                    , 'occurredDate'
                ],
                [Sequelize.fn('count', 'occurred_date'), 'count']
            ],
            where: {
                logLevel: LogLevel.INFO,
                logName: LogName.INFO.API_CALL_INFO,
                occurredDate: {
                    [Op.gte]: startOfMinute(subMinutes(now, 59))
                }
            },
            // Sequelize의 최대 단점..
            group: [ 
                Sequelize.fn('DATE_FORMAT', Sequelize.col('occurred_date'), '%H:%i') 
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    apicalls.forEach(apicall => {
        const index = timetable.findIndex(element => element.date === apicall.occurredDate);
        if(index) timetable[index].count = apicall.count;
    })

    res.json({
        result: timetable
    })
});
*/

let timetable = [];

router.get('/info/apicall/transition', async (req, res, next) => {

    const now = new Date();
    let newTimetable = timetable.filter(t => t.date >= format(subMinutes(now, 59), Constants.TIME_FORMAT));

    for (let i = newTimetable.length; i <= 59; i++) {
        newTimetable.push({
            date: format(subMinutes(now, 59 - i), Constants.TIME_FORMAT),
            count: Math.floor(Math.random() * (50 - 5 + 1)) + 5
        })
    }

    timetable = newTimetable;
    // console.log(timetable);


    res.json({
        result: timetable
    })
});

router.get('/', [
    query('occurredDateStart').matches(Constants.DATETIME_FORMAT_REGEX).optional(),
    query('occurredDateEnd').matches(Constants.DATETIME_FORMAT_REGEX).custom((occurredDateEnd, { req }) => {
        if (occurredDateEnd < req.query.occurredDateStart) {
            throw new Error();
        }
        return occurredDateEnd;
    }).optional(),
    query('siteId').isNumeric().toInt().optional(),
    query('serviceId').isNumeric().toInt().optional(),
    query('instanceId').isNumeric().toInt().optional(),
    query('logLevel').isString().isIn(Object.values(LogLevel).map(logLevel => logLevel)).optional(),
    query('logName').isString().isIn([
        ...Object.values(LogName.INFO).map(value => value), 
        ...Object.values(LogName.ERROR).map(value => value)
    ]).optional(),
    query('logDetail').isString().trim().isLength({ max: 20 }).customSanitizer(value => value.toLowerCase()).optional(),
    pagingMiddleware(Constants.PER_PAGE, ['occurredDate', 'siteName', 'serviceName', 'instanceName', 'logLevel', 'logName'])
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { perPage, page, sort, offset, limit } = req.paging;
    const { occurredDateStart, occurredDateEnd, siteId, serviceId, instanceId, logLevel, logName, logDetail } = req.query;

    const whereClause = {};
    if (occurredDateStart !== undefined) {
        whereClause.occurredDate = {
            [Op.gte]: parse(occurredDateStart, Constants.DATETIME_FORMAT, new Date())
        };
    }
    if (occurredDateEnd !== undefined) {
        whereClause.occurredDate = {
            [Op.lte]: parse(occurredDateEnd, Constants.DATETIME_FORMAT, new Date())
        };
    }
    if (occurredDateStart !== undefined && occurredDateEnd !== undefined) {
        whereClause.occurredDate = {
            [Op.between]: [
                parse(occurredDateStart, Constants.DATETIME_FORMAT, new Date()),
                parse(occurredDateEnd, Constants.DATETIME_FORMAT, new Date())
            ]
        };
    }
    if (siteId !== undefined) {
        whereClause.siteId = siteId
    }
    if (serviceId !== undefined) {
        whereClause.serviceId = serviceId
    }
    if (instanceId !== undefined) {
        whereClause.instanceId = instanceId
    }
    if (logLevel !== undefined) {
        whereClause.logLevel = logLevel
    }
    if (logName !== undefined) {
        whereClause.logName = logName
    }
    if (logDetail !== undefined) {
        whereClause.logDetail = {
            [Op.like]: '%' + logDetail + '%'
        };
    }

    let orderClause = [ 
        ['occurredDate', 'desc']
    ];
    if(sort.length > 0) {
        orderClause = sort.map(s => {
            switch (s.key) {
                case 'siteName':
                    return [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = log.site_id)'), s.value];
                case 'serviceName':
                    return [Sequelize.literal('(SELECT service.name FROM service WHERE service.id = log.service_id)'), s.value];
                case 'instanceName':
                    return [Sequelize.literal('(SELECT instance.name FROM instance WHERE instance.id = log.instance_id)'), s.value];
                default:
                    return [s.key, s.value];
            }
        });
    }

    let logs;

    try {
        logs = await Log.findAndCountAll({
            raw: true,
            attributes: [
                'id',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('occurred_date'), '%Y-%m-%d %H:%i'), 'occurredDate'],
                'siteId',
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = log.site_id)'), 'siteName'],
                'serviceId',
                [Sequelize.literal('(SELECT service.name FROM service WHERE service.id = log.service_id)'), 'serviceName'],
                'instanceId',
                [Sequelize.literal('(SELECT instance.name FROM instance WHERE instance.id = log.instance_id)'), 'instanceName'],
                'logLevel',
                'logName',
                'logDetail'
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

    res.json({
        result: logs.rows,

        perPage,
        page,
        sort,
        totalPage: Math.ceil(logs.count / perPage),
        totalCount: logs.count
    });
});


module.exports = router;