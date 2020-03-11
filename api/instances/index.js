import express from 'express';
import { validationResult, param } from 'express-validator';
const router = express.Router();

router.get('/health', async (req, res, next) => {
    
    const resultInstances = mockInstances.map(instance => {
        return {
            instanceId: instance.instanceId,
            instanceName: instance.instanceName,
            siteId: instance.siteId,
            siteName: instance.siteName,
            status: instance.status, 
        }
    });

    res.json({
        result: resultInstances
    });
});

router.get('/:instanceId', [
    param('instanceId').isNumeric()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    // type casting 기능?
    const { instanceId } = req.params;
    
    const foundInstance = mockInstances.find(instance => instance.instanceId == instanceId);

    if(!foundInstance) {
        return res.status(404).send();
    }

    res.json({
        result: {
            instanceId: foundInstance.instanceId,
            instanceName: foundInstance.instanceName,
            siteId: foundInstance.siteId,
            siteName: foundInstance.siteName,
            serviceId: foundInstance.serviceId,
            serviceName: foundInstance.serviceName,
            endpoint: foundInstance.endpoint,
            status: foundInstance.status, 
        }
    });
});

const mockInstances = [
    {
        instanceId: 1,
        instanceName: "재직증명서 발급 서비스 인스턴스 #1",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 1,
        serviceName: "재직증명서 발급",
        endpoint: "http://10.10.101.1:8080",
        status: true
    },
    {
        instanceId: 2,
        instanceName: "재직증명서 발급 서비스 인스턴스 #2",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 1,
        serviceName: "재직증명서 발급",
        endpoint: "http://10.10.101.2:8080",
        status: true
    },
    {
        instanceId: 3,
        instanceName: "법인카드 발급 서비스 인스턴스 #1",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 2,
        serviceName: "법인카드 발급",
        endpoint: "http://10.10.101.3:8080",
        status: true
    },
    {
        instanceId: 4,
        instanceName: "법인카드 발급 서비스 인스턴스 #2",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 2,
        serviceName: "법인카드 발급",
        endpoint: "http://10.10.101.4:8080",
        status: true
    },
    {
        instanceId: 5,
        instanceName: "전자사원증 발급 서비스 인스턴스 #1",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 3,
        serviceName: "전자사원증 발급",
        endpoint: "http://10.10.101.5:8080",
        status: true
    },
    {
        instanceId: 6,
        instanceName: "전자사원증 발급 서비스 인스턴스 #2",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 3,
        serviceName: "전자사원증 발급",
        endpoint: "http://10.10.101.6:8080",
        status: true
    },
    {
        instanceId: 7,
        instanceName: "갑근세영수증 발급 서비스 인스턴스 #1",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 4,
        serviceName: "갑근세영수증 발급",
        endpoint: "http://10.10.101.7:8080",
        status: true
    },
    {
        instanceId: 8,
        instanceName: "갑근세영수증 발급 서비스 인스턴스 #2",
        siteId: 1,
        siteName: "현대카드",
        serviceId: 4,
        serviceName: "갑근세영수증 발급",
        endpoint: "http://10.10.101.8:8080",
        status: true
    },   
];

module.exports = router;