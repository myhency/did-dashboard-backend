import express from 'express';
import Site from '../../db/models/Site';
import { validationResult, param } from 'express-validator';
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
                'logoFileName',
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
            if(site.logoFileName === null) {
                delete site['logoFileName'];
            } 
            return site;
        })
    });
});

router.get('/:siteId', [
    param('siteId').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { siteId } = req.params;

    let site;

    try {
        site = await Site.findOne({
            raw: true,
            attributes: [
                'siteId',
                'name',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d')
                    , 'openDate'
                ],
                'logoFileName'
            ],
            where: {
                siteId: siteId
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if(!site) {
        return res.status(404).send();
    }

    if(site.logoFileName === null) {
        delete site['logoFileName'];
    } 

    res.json({
        result: site
    });
});

module.exports = router;