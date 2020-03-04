import express from 'express';
const router = express.Router();

router.get('/count', async (req, res, next) => {
    res.json({
        result: 1
    })
});

module.exports = router;