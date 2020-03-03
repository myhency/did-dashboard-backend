const express = require('express');
const router = express.Router();
const models = require('../../db/models');

router.get('/', (req, res) => {
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit, 10);
    if(Number.isNaN(limit)) {
        return res.status(400).end();
    }

    models.User.findAll({
        limit: limit
    })
    .then(users => {
        res.json(users);    
    });
});

router.get('/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if(Number.isNaN(id)) return res.status(400).end();
  
    models.User.findOne({
        where: {
            id: id
        }
    }).then(user => {
        if(!user) return res.status(404).end();
        res.json(user);
    }) 
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(Number.isNaN(id)) return res.status(400).end();
    
    models.User.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(204).end();
    })
    
});

router.post('/', (req, res) => {
    const name = req.body.name;
    if(!name) return res.status(400).end();

    models.User.create({
        name: name
    })
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        if(err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).end();
        }
        res.status(500).end();
    })

});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(Number.isNaN(id)) return res.status(400).end();
    const name = req.body.name;
    if(!name) return res.status(400).end();
    
    models.User.findOne({
        where: {
            id: id
        }
    })
    .then(user => {
        if(!user) return res.status(404).end();

        user.name = name;
        user.save()
            .then(_ => {
                res.json(user);
            })
            .catch(err => {
                if(err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409).end();
                }
                res.status(500).end();
            })
    })
});

module.exports = router;