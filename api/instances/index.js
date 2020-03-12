import express from 'express';
import { validationResult, param, query } from 'express-validator';
import Instance from '../../db/models/Instance';
import { Sequelize } from 'sequelize';
const router = express.Router();

router.get('/health', async (req, res, next) => {
    
    let instances;

    try {
        instances = await Instance.findAll({
            attributes: [
                'id',
                'name',
                // 'endpoint',
                'status',
                // 'serviceId',
                // [ Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'),  'serviceName' ],
                [ Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'),  'siteId' ],
                [ Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'),  'siteName' ],
            ],
            order: [
                ['status', 'ASC']
            ]
        })
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: instances
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

    let instance;

    try {
        instance = await Instance.findOne({
            attributes: [
                'id',
                'name',
                'endpoint',
                'status',
                'serviceId',
                [ Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'),  'serviceName' ],
                [ Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'),  'siteId' ],
                [ Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'),  'siteName' ],
            ],
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }
    

    if(!instance) {
        return res.status(404).send();
    }

    res.json({
        result: instance
    });
});

router.get('/', [
    query('siteId').isNumeric().toInt().optional(),
    query('serviceId').isNumeric().toInt().optional(),
    query('status').isBoolean().toBoolean().optional()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { siteId, serviceId, status } = req.query;

    const whereClause = {};
    if(siteId !== undefined) {
        whereClause.serviceId = Sequelize.literal(`service_id IN (SELECT service.id FROM service WHERE service.site_id = ${siteId})`)
    }
    if(serviceId !== undefined) {
        whereClause.serviceId = serviceId
    }
    if(status !== undefined) {
        whereClause.status = status
    }

    let instances;

    try {
        instances = await Instance.findAll({
            attributes: [
                'id',
                'name',
                'endpoint',
                'status',
                'serviceId',
                [ Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'),  'serviceName' ],
                [ Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'),  'siteId' ],
                [ Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'),  'siteName' ],
            ],
            where: whereClause,
            order: [
                ['id', 'ASC']
            ]
        })
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: instances
    });
});

module.exports = router;