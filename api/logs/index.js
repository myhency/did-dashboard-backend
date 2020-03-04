import express from 'express';
import { Op, Sequelize } from 'sequelize';
import Log from '../../db/models/Log';
import { format, subMinutes } from 'date-fns';
import _ from 'lodash';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
const router = express.Router();

router.get('/error/count', async (req, res, next) => {
    let count;

    try {
        count = await Log.count({
            where: {
                logLevel: LogLevel.ERROR,
                timestamp: {
                    [Op.gte]: subMinutes(new Date(), 60)
                }
            }
        });
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: count
    })
});

router.get('/info/apicall/transition', async (req, res, next) => {
    
    const now = new Date();
    const timetable = _.range(59, -1).map(i => {
        return {
            timestamp: format(subMinutes(now, i), 'HH:mm'),
            count: 0
        }
    });
    
    let apicalls;

    try {
        apicalls = await Log.findAll({
            raw: true,
            attributes: [
                [
                    process.env.NODE_ENV === 'test' ?
                        Sequelize.fn('strftime', '%H:%M', Sequelize.col('timestamp'), 'localtime')
                        : Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%H:%i')
                    , 'timestamp'
                ],
                [Sequelize.fn('count', 'timestamp'), 'count']
            ],
            where: {
                logLevel: LogLevel.INFO,
                logName: LogName.INFO.API_CALL_INFO,
                timestamp: {
                    [Op.gte]: subMinutes(now, 59)
                }
            },
            // Sequelize의 최대 단점..
            group: [ 
                process.env.NODE_ENV === 'test' ?
                    Sequelize.fn('strftime', '%H:%M', Sequelize.col('timestamp'), 'localtime')
                    : Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%H:%i')
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    apicalls.forEach(apicall => {
        const index = timetable.findIndex(element => element.timestamp === apicall.timestamp);
        timetable[index].count = apicall.count;
    })

    res.json({
        result: timetable
    })
});

module.exports = router;