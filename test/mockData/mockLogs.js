import { subMinutes } from 'date-fns';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';

const logs = [
    {
      logId: 1,
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
    {
      logId: 2,
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
    {
      logId: 3,
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
    {
      logId: 4,
      timestamp: subMinutes(new Date(), 3),
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
      logId: 5,
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
      logId: 6,
      timestamp: subMinutes(new Date(), 4),
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
      logId: 7,
      timestamp: subMinutes(new Date(), 5),
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
      logId: 8,
      timestamp: subMinutes(new Date(), 6),
      siteId: 1,
      serviceId: 1,
      instanceId: 1,
      logLevel: LogLevel.INFO,
      logName: LogName.INFO.CREDENTIAL_VERIFICATION_INFO,
      logDetail: JSON.stringify({
        message:'credential verification info'
      })
    },
    {
      logId: 9,
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