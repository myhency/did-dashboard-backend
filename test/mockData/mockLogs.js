import { subDays, subHours, subMinutes, subSeconds } from 'date-fns';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import _ from 'lodash';

const logs = [];
const endDate = new Date();
const startDate = subDays(endDate, 30);

[1].forEach(siteId => { // siteId
  [1, 2, 3, 4].forEach(serviceId => { // serviceId
    [1, 2].forEach(instanceId => { // instanceId
      _.times(100, () => { // instance 별 로그 수
        insertLegacyErrorLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        insertLedgerErrorLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        insertInternalErrorLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        insertApiCallInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(subHours(endDate, 10), endDate));
        insertNewPairwisedidInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));

        if(serviceId == 1) { // issuer
          insertCredentialIssuanceInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
          insertCredentialRevocationInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        } else if(serviceId == 2 || serviceId == 3) { // verifier
          insertCredentialVerificationInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        } else if (serviceId == 4) { // verissuer
          insertCredentialIssuanceInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
          insertCredentialVerificationInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
          insertCredentialRevocationInfoLog(siteId, serviceId, (serviceId-1)*2 + instanceId, randomDate(startDate, endDate));
        }
      })
    })
  })
});

// console.log(logs);
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
} 

function insertLegacyErrorLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.LEGACY_ERROR,
    logDetail: JSON.stringify({ message:'legacy error detail' })
  });
}

function insertLedgerErrorLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.LEDGER_ERROR,
    logDetail: JSON.stringify({ message:'ledger error detail' })
  });
}

function insertInternalErrorLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.ERROR,
    logName: LogName.ERROR.INTERNAL_ERROR,
    logDetail: JSON.stringify({ message:'internal error detail' })
  });
}

function insertApiCallInfoLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.API_CALL_INFO,
    logDetail: JSON.stringify({ message:'api call info detail' })
  });
}

function insertNewPairwisedidInfoLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.NEW_PAIRWISEDID_INFO,
    logDetail: JSON.stringify({ message:'new pairwisedid info detail' })
  });
}

function insertCredentialIssuanceInfoLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_ISSUANCE_INFO,
    logDetail: JSON.stringify({ message:'credential issuance info detail' })
  });
}

function insertCredentialVerificationInfoLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_VERIFICATION_INFO,
    logDetail: JSON.stringify({ message:'credential verification info detail' })
  });
}

function insertCredentialRevocationInfoLog(siteId, serviceId, instanceId, date) {
  logs.push({
    timestamp: date,
    siteId,
    serviceId,
    instanceId,
    logLevel: LogLevel.INFO,
    logName: LogName.INFO.CREDENTIAL_REVOCATION_INFO,
    logDetail: JSON.stringify({ message:'credential revocation info detail' })
  });
}

export default logs;
