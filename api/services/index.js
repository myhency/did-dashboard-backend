import express from 'express';
import Role from '../../enums/Role';
import { validationResult, param } from 'express-validator';
import Log from '../../db/models/Log';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import { Sequelize, Op } from 'sequelize';
import { format, startOfToday, startOfHour, subHours } from 'date-fns';
import _ from 'lodash';
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

router.get('/:serviceId/statistic', [
    param('serviceId').isNumeric()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { serviceId } = req.params;

    let cumulativeInfoLogs;
    let todayInfoLogs;

    try {
        cumulativeInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [Sequelize.fn('count', 'logName'), 'count']
            ],
            where: {
                serviceId: serviceId,
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.NEW_PAIRWISEDID_INFO, 
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: 'logName'
        });
    } catch (err) {
        next(err);
        return;
    }

    try {
        todayInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [Sequelize.fn('count', 'logName'), 'count']
            ],
            where: {
                serviceId: serviceId,
                timestamp: {
                    [Op.gte]: startOfToday()
                },
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.NEW_PAIRWISEDID_INFO, 
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: 'logName'
        });
    } catch (err) {
        next(err);
        return;
    }

    const cumulativeInfosLogsJson = cumulativeInfoLogs.reduce((acc, element) => {
        acc[element.logName] = element.count;
        return acc;
    }, {
        NEW_PAIRWISEDID_INFO: 0,
        CREDENTIAL_ISSUANCE_INFO: 0,
        CREDENTIAL_VERIFICATION_INFO: 0
    });

    const cumulativePairwisedid = cumulativeInfosLogsJson[LogName.INFO.NEW_PAIRWISEDID_INFO]
    const cumulativeCredentialIssuance = cumulativeInfosLogsJson[LogName.INFO.CREDENTIAL_ISSUANCE_INFO];
    const cumulativeCredentialVerification = cumulativeInfosLogsJson[LogName.INFO.CREDENTIAL_VERIFICATION_INFO];
    

    const todayInfoLogsJson = todayInfoLogs.reduce((acc, element) => {
        acc[element.logName] = element.count;
        return acc;
    }, {
        NEW_PAIRWISEDID_INFO: 0,
        CREDENTIAL_ISSUANCE_INFO: 0,
        CREDENTIAL_VERIFICATION_INFO: 0
    });

    const todayPairwisedid = todayInfoLogsJson[LogName.INFO.NEW_PAIRWISEDID_INFO]
    const todayCredentialIssuance = todayInfoLogsJson[LogName.INFO.CREDENTIAL_ISSUANCE_INFO];
    const todayCredentialVerification = todayInfoLogsJson[LogName.INFO.CREDENTIAL_VERIFICATION_INFO];

    

    res.json({
        result: {
            cumulativePairwisedid,
            cumulativeCredentialIssuance,
            cumulativeCredentialVerification,
            todayPairwisedid,
            todayCredentialIssuance,
            todayCredentialVerification
        }
    });
});


router.get('/:serviceId/transition', [
    param('serviceId').isNumeric()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send();
    }

    const { serviceId } = req.params;

    const now = new Date();
    const timetable = _.range(23, -1).map(i => {
        return {
            timestamp: format(startOfHour(subHours(now, i)), 'yyyy-MM-dd HH:mm'),
            issuance: 0,
            verification: 0
        }
    });

    let recentInfoLogs;

    try {
        recentInfoLogs = await Log.findAll({
            raw: true,
            attributes: [
                'logName',
                [
                    Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d %H:00')
                    , 'timestamp'
                ]
            ],
            where: {
                serviceId: serviceId,
                timestamp: {
                    [Op.gte]: startOfHour(subHours(now, 23))
                },
                logLevel: LogLevel.INFO,
                logName: {
                    [Op.in]: [
                        LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
                        LogName.INFO.CREDENTIAL_VERIFICATION_INFO
                    ]
                }
            },
            group: [    
                Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d %H:00'),
                'logName'
            ]
        });
    } catch (err) {
        next(err);
        return;
    }

    recentInfoLogs.forEach(info => {
        const index = timetable.findIndex(e => e.timestamp === info.timestamp);
        if(index && info.logName === LogName.INFO.CREDENTIAL_ISSUANCE_INFO)
            timetable[index].issuance += 1;
        if(index && info.logName === LogName.INFO.CREDENTIAL_VERIFICATION_INFO)
            timetable[index].verification += 1;
    });

    res.json({
        result: timetable
    })
});

module.exports = router;