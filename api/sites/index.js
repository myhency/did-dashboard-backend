import express from 'express';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import { Sequelize } from 'sequelize';
const router = express.Router();

router.get('/count', async (req, res, next) => {
    let result;

    try {
        result = await Site.count();
    } catch(err) {
        next(err);
        return;
    }

    res.json({
        result
    })
});

router.get('/', async (req, res, next) => {
    let sites;

    try {
        sites = await Site.findAll({
            raw: true,
            attributes: [
                'siteId',
                'name',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d')
                    , 'openDate'
                ],
                'logoImageName',
                [
                    Sequelize.literal('(SELECT COUNT(site_id) FROM service WHERE service.site_id = site.site_id)'),  'countOfServices'
                ]
            ]
        })
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: sites.map(site => {
            if(site.logoImageName === null) {
                delete site['logoImageName'];
            } 
            return site;
        })
    });
});

module.exports = router;