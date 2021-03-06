import express from 'express';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import { validationResult, param, query, body } from 'express-validator';
import { Sequelize, Op } from 'sequelize';
import Constants from '../../constants';
import multer from 'multer';
import { parse, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/logos/');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    },    
});
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, callback) {
        const typeArray = file.mimetype.split('/');
        const fileType  = typeArray[1];
        if(fileType !== 'jpg' && fileType !== 'jpeg' && fileType !== 'gif' && fileType !== 'png') {
            req.fileValidationError = "jpg/jpeg/gif/png 파일만 업로드 가능합니다.";
            return callback(null, false);
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
});

router.get('/count', async (req, res, next) => {
    let result;

    try {
        result = await Site.count();
    } catch (err) {
        next(err);
        return;
    }

    res.json({
        result
    })
});

router.get('/', [
    query('name').isString().trim().notEmpty().customSanitizer(value => value.toUpperCase()).optional()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { name } = req.query;

    let sites;

    const whereClause = {};
    if (name !== undefined) {
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
                'openDate',
                'logoFileName',
                [
                    Sequelize.literal('(SELECT COUNT(site_id) FROM service WHERE service.site_id = site.id)'), 'numberOfServices'
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
            site.openDate = format(site.openDate, Constants.DATE_FORMAT);
            if (site.logoFileName === null) {
                delete site['logoFileName'];
            }
            return site;
        })
    });
});

router.get('/:id', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
                'openDate',
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

    if (!site) {
        return res.status(404).send();
    }

    site.openDate = format(site.openDate, Constants.DATE_FORMAT);
    
    if (site.logoFileName === null) {
        delete site['logoFileName'];
    }

    res.json({
        result: site
    });
});

router.delete('/:id', [
    param('id').isInt({ min: 1 }).toInt()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { id } = req.params;

    let serviceCount;

    try {
        serviceCount = await Service.count({
            where: {
                siteId: id
            }
        });
    } catch(err) {
        next(err);
        return;
    }

    if(serviceCount > 0) {
        return res.status(409).send();
    }

    let deletedCount;

    try {
        deletedCount = await Site.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (deletedCount === 0) {
        return res.status(404).send();
    }

    return res.status(204).send();
});

router.put('/:id', [
    param('id').isInt({ min: 1 }).toInt(),
    upload.single('logoFile'),

    body('name').isString().trim().notEmpty(),
    body('openDate').matches(Constants.DATE_FORMAT_REGEX),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }

    if (req.fileValidationError) {
        return res.status(400).send();
    }

    const { id } = req.params;
    const { name, openDate } = req.body;
    const logoFile = req.file;

    let site;

    try {
        site = await Site.findOne({
            where: {
                id: id
            }
        })
    } catch (err) {
        next(err);
        return;
    }

    if (!site) {
        return res.status(404).send();
    }

    try {
        site.name = name;
        site.openDate = parse(openDate, Constants.DATE_FORMAT, new Date());
        if(logoFile) {
            site.logoFileName = logoFile.path.replace(/\\/g,"/");
        }
        site = await site.save();
    } catch(err) {
        next(err);
        return;
    }

    return res.status(201).send({
        result: {
            id: site.id
        }
    });
});

router.post('/', [
    upload.single('logoFile'),

    body('name').isString().trim().notEmpty(),
    body('openDate').matches(Constants.DATE_FORMAT_REGEX),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send();
    }
    if (req.fileValidationError) {
        return res.status(400).send();
    }
    
    const { name, openDate } = req.body;
    const logoFile = req.file;

    let site;

    try {
        site = await Site.create({
            name,
            openDate: parse(openDate, Constants.DATE_FORMAT, new Date()),
            logoFileName: (logoFile ? logoFile.path.replace(/\\/g,"/") : null)
        });
    } catch(err) {
        next(err);
        return;
    }

    return res.status(201).send({
        result: {
            id: site.id
        }
    })
});

module.exports = router;