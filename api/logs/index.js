import express from 'express';
import { Op, Sequelize } from 'sequelize';
import Log from '../../db/models/Log';
import { format, subMinutes, startOfMinute } from 'date-fns';
import _ from 'lodash';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
const router = express.Router();

router.get('/error/count', async (req, res, next) => {
    let count;

    // try {
    //     count = await Log.count({
    //         where: {
    //             logLevel: LogLevel.ERROR,
    //             timestamp: {
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
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%H:%i')
                    , 'timestamp'
                ],
                [Sequelize.fn('count', 'timestamp'), 'count']
            ],
            where: {
                logLevel: LogLevel.INFO,
                logName: LogName.INFO.API_CALL_INFO,
                timestamp: {
                    [Op.gte]: startOfMinute(subMinutes(now, 59))
                }
            },
            // Sequelize의 최대 단점..
            group: [ 
                Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%H:%i') 
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    apicalls.forEach(apicall => {
        const index = timetable.findIndex(element => element.timestamp === apicall.timestamp);
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
    let newTimetable = timetable.filter(t => t.timestamp >= format(subMinutes(now, 59), 'HH:mm'));
    console.log(newTimetable);
    
    for (let i = newTimetable.length; i <= 59; i++) {
        newTimetable.push({
            timestamp: format(subMinutes(now, 59-i), 'HH:mm'),
            count: Math.floor(Math.random() * (50 - 5 + 1)) + 5
        })
    }

    timetable = newTimetable;
    console.log(timetable);
  

    res.json({
        result: timetable
    })
});

module.exports = router;