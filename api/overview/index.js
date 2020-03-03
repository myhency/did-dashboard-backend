import express from 'express';
import { Op } from 'sequelize';
import Log from '../../db/models/Log';
import { subMinutes } from 'date-fns';
const router = express.Router();

router.get('/errors', async (req, res, next) => {
    let count;

    try {
        count = await Log.count({
            where: {
                logLevel: 'ERROR',
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