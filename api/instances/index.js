import express from 'express';
const router = express.Router();

router.get('/health', async (req, res, next) => {
    
    res.json({
        result: [
            {
                instanceId: 1,
                instanceName: "재직증명서 발급 서비스 인스턴스 #1",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 2,
                instanceName: "재직증명서 발급 서비스 인스턴스 #2",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 3,
                instanceName: "법인카드 발급 서비스 인스턴스 #1",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 4,
                instanceName: "법인카드 발급 서비스 인스턴스 #2",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 5,
                instanceName: "전자사원증 발급 서비스 인스턴스 #1",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 6,
                instanceName: "전자사원증 발급 서비스 인스턴스 #2",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 7,
                instanceName: "갑근세영수증 발급 서비스 인스턴스 #1",
                siteName: "현대카드",
                status: true
            },
            {
                instanceId: 8,
                instanceName: "갑근세영수증 발급 서비스 인스턴스 #2",
                siteName: "현대카드",
                status: true
            },
            
        ]
    })
});

module.exports = router;