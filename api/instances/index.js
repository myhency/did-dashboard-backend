import express from 'express';
import { validationResult, param, query, body } from 'express-validator';
import Instance from '../../db/models/Instance';
import Service from '../../db/models/Service';
import Log from '../../db/models/Log';
import { Sequelize } from 'sequelize';
import sequelize from '../../db/models';
import pagingMiddleware from '../../common/middleware/pagingMiddleware';
import Constants from '../../constants';
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
                [Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'), 'siteId'],
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'), 'siteName'],
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
    if (!errors.isEmpty()) {
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
                [Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'), 'serviceName'],
                [Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'), 'siteId'],
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'), 'siteName'],
            ],
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }


    if (!instance) {
        return res.status(404).send();
    }

    res.json({
        result: instance
    });
});

router.get('/', [
    query('siteId').isNumeric().toInt().optional(),
    query('serviceId').isNumeric().toInt().optional(),
    query('status').isBoolean().toBoolean().optional(),
    pagingMiddleware(Constants.PER_PAGE, ['siteName', 'serviceName', 'name', 'endpoint', 'status'])
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { perPage, page, sort, offset, limit } = req.paging;
    const { siteId, serviceId, status } = req.query;

    const whereClause = {};
    if (siteId !== undefined) {
        whereClause.serviceId = Sequelize.literal(`service_id IN (SELECT service.id FROM service WHERE service.site_id = ${siteId})`)
    }
    if (serviceId !== undefined) {
        whereClause.serviceId = serviceId
    }
    if (status !== undefined) {
        whereClause.status = status
    }

    let orderClause = [ 
        ['id', 'asc']
    ];
    if(sort.length > 0) {
        orderClause = sort.map(s => {
            switch (s.key) {
                case 'siteName':
                    return [Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'), s.value];
                case 'serviceName':
                    return [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'), s.value];
                default:
                    return [s.key, s.value];
            }
        });
    }

    let instances;

    try {
        instances = await Instance.findAndCountAll({
            attributes: [
                'id',
                'name',
                'endpoint',
                'status',
                'serviceId',
                [Sequelize.literal('(SELECT service.name FROM service WHERE service.id = instance.service_id)'), 'serviceName'],
                [Sequelize.literal('(SELECT service.site_id FROM service WHERE service.id = instance.service_id)'), 'siteId'],
                [Sequelize.literal('(SELECT site.name FROM site WHERE site.id = (SELECT service.site_id FROM service WHERE service.id = instance.service_id))'), 'siteName'],
            ],
            where: whereClause,
            order: orderClause,
            offset: offset,
            limit: limit,
        })
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result: instances.rows,

        perPage,
        page,
        sort,
        totalPage: Math.ceil(instances.count / perPage),
        totalCount: instances.count
    });
});

router.delete('/:id', [
    param('id').isNumeric().toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    try {
        await sequelize.transaction(async (t) => {
            const deletedCount = await Instance.destroy({
                where: {
                    id: id
                }
            })
    
            if (deletedCount === 0) {
                throw new Error('not found');
            }

            await Log.destroy({
                where: {
                    instanceId: id
                }
            });
        });
    } catch (err) {
        if(err.message === 'not found') {
            return res.status(404).send();
        }
        next(err);
        return;
    }

    return res.status(204).send();
});

router.post('/', [
    body('serviceId').isNumeric().toInt(),
    body('name').isString().trim().notEmpty(),
    body('endpoint').isString().trim().notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { serviceId, name, endpoint } = req.body;

    let serviceCount; 

    try {
        serviceCount = await Service.count({
            where: {
                id: serviceId
            }
        });
    } catch(err) {
        next(err);
        return;
    }

    // 존재하지 않는 사이트라면 400을 리턴한다.
    if(serviceCount === 0) {
        return res.status(400).send();    
    }

    let instance;

    try {
        instance = await Instance.create({
            serviceId,
            name,
            endpoint,
            status: true
        });
    } catch(err) {
        next(err);
        return;
    }

    return res.status(201).send({
        result: {
            id: instance.id
        }
    });
});

module.exports = router;