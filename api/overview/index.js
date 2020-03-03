import express from 'express';
import { Op } from 'sequelize';
import Log from '../../db/models/Log';
import { subMinutes } from 'date-fns';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
const router = express.Router();

router.get('/errors/count', async (req, res, next) => {
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

router.get('/apicalls/count', async (req, res, next) => {
    let count;

    try {
        count = await Log.count({
            where: {
                logLevel: LogLevel.INFO,
                logName: LogName.INFO.API_CALL_INFO,
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

module.exports = router;