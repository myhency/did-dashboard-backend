import express from 'express';
import Role from '../../enums/Role';
const router = express.Router();

router.get('/', async (req, res, next) => {
    
    res.json({
        result: [
            {
                siteId: 1,
                siteName: "현대카드",
                serviceId: 1,
                serviceName: "재직증명서 발급 서비스",
                role: Role.ISSUER
            },
            {
                siteId: 1,
                siteName: "현대카드",
                serviceId: 2,
                serviceName: "법인카드 발급 서비스",
                role: Role.VERIFIER
            },
            {
                siteId: 1,
                siteName: "현대카드",
                serviceId: 3,
                serviceName: "전자사원증 발급 서비스",
                role: Role.VERIFIER
            },
            {
                siteId: 1,
                siteName: "현대카드",
                serviceId: 4,
                serviceName: "갑근세영수증 발급 서비스",
                role: Role.VERISSUER
            }
        ]
    })
});

router.get('/count', async (req, res, next) => {
    
    res.json({
        result: 4
    })
});

module.exports = router;