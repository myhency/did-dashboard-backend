import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';

const logs = [
  // ERROR.LEGACY_ERROR
  {
    logId: 100,
    timestamp: new Date(),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.LEGACY_ERROR,
    logDetail: JSON.stringify({
      message:'legacy error detail'
    })
  },
  // ERROR.LEDGER_ERROR
  {
    logId: 200,
    timestamp: subMinutes(new Date(), 1),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.LEDGER_ERROR,
    logDetail: JSON.stringify({
      message:'ledger error detail'
    })
  },
  // ERROR.INTERNAL_ERROR
  {
    logId: 300,
    timestamp: subMinutes(new Date(), 2),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.INTERNAL_ERROR,
    logDetail: JSON.stringify({
      message:'internal error detail'
    })
  },
  // INFO.API_CALL_INFO
  {
    logId: 400,
    timestamp: subMinutes(new Date(), 59),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.API_CALL_INFO,
    logDetail: JSON.stringify({
      message:'api call info'
    })
  },
  {
    logId: 401,
    timestamp: subMinutes(new Date(), 60),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.API_CALL_INFO,
    logDetail: JSON.stringify({
      message:'api call info'
    })
  },
  {
    logId: 402,
    timestamp: subMinutes(new Date(), 4),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.API_CALL_INFO,
    logDetail: JSON.stringify({
      message:'api call info'
    })
  },
  {
    logId: 410,
    timestamp: subMinutes(new Date(), 30),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.API_CALL_INFO,
    logDetail: JSON.stringify({
      message:'api call info'
    })
  },
  // INFO.NEW_PAIRWISEDID_INFO
  {
    logId: 500,
    timestamp: subDays(new Date(), 4),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  {
    logId: 501,
    timestamp: subDays(new Date(), 3),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  {
    logId: 502,
    timestamp: subDays(new Date(), 4),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  {
    logId: 503,
    timestamp: subHours(new Date(), 1),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  {
    logId: 504,
    timestamp: subDays(new Date(), 2),
    siteId: 1,
    serviceId: 2,
    instanceId: 3,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  {
    logId: 505,
    timestamp: subHours(new Date(), 1),
    siteId: 1,
    serviceId: 2,
    instanceId: 4,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({
      message:'new pairwisedid info'
    })
  },
  // INFO.CREDENTIAL_ISSUANCE_INFO
  {
    logId: 600,
    timestamp: subDays(new Date(), 2),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
    logDetail: JSON.stringify({
      message:'credential issuance info'
    })
  },
  {
    logId: 601,
    timestamp: subMinutes(new Date(), 5),
    siteId: 1,
    serviceId: 1,
    instanceId: 2,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
    logDetail: JSON.stringify({
      message:'credential issuance info'
    })
  },
  {
    logId: 602,
    timestamp: subHours(new Date(), 5),
    siteId: 1,
    serviceId: 1,
    instanceId: 2,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
    logDetail: JSON.stringify({
      message:'credential issuance info'
    })
  },
  {
    logId: 603,
    timestamp: subHours(new Date(), 10),
    siteId: 1,
    serviceId: 1,
    instanceId: 2,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
    logDetail: JSON.stringify({
      message:'credential issuance info'
    })
  },
  // INFO.CREDENTIAL_VERIFICATION_INFO
  {
    logId: 700,
    timestamp: subDays(new Date(), 6),
    siteId: 1,
    serviceId: 2,
    instanceId: 3,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_VERIFICATION_INFO,
    logDetail: JSON.stringify({
      message:'credential verification info'
    })
  },
  {
    logId: 701,
    timestamp: subMinutes(new Date(), 6),
    siteId: 1,
    serviceId: 2,
    instanceId: 4,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_VERIFICATION_INFO,
    logDetail: JSON.stringify({
      message:'credential verification info'
    })
  },
  // INFO.CREDENTIAL_REVOCATION_INFO
  {
    logId: 800,
    timestamp: subMinutes(new Date(), 7),
    siteId: 1,
    serviceId: 1,
    instanceId: 1,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_REVOCATION_INFO,
    logDetail: JSON.stringify({
      message:'credential revocation info'
    })
  }
];

export default logs;