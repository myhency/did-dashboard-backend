import express from 'express';
import Site from '../../db/models/Site';
import { validationResult, param, query } from 'express-validator';
import { Sequelize, Op } from 'sequelize';
import Constants from '../../constants';
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

router.get('/', [
    query('name').isString().trim().customSanitizer(value => value.toUpperCase()).optional()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { name } = req.query;

    let sites;

    const whereClause = {};
    if(name) {
        whereClause.name = {
            [Op.like]: '%' + name + '%'
        };
    }

    try {
        sites = await Site.findAll({
            raw: true,
            attributes: [
                'id',
                'name',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d')
                    , 'openDate'
                ],
                'logoFileName',
                [
                    Sequelize.literal('(SELECT COUNT(site_id) FROM service WHERE service.site_id = site.id)'),  'countOfServices'
                ]
            ],
            where: whereClause
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

router.get('/:id', [
    param('id').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let site;

    try {
        site = await Site.findOne({
            raw: true,
            attributes: [
                'id',
                'name',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('open_date'), '%Y-%m-%d')
                    , 'openDate'
                ],
                'logoFileName'
            ],
            where: {
                id: id
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