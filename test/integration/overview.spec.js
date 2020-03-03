const request = require('supertest');
const should = require('should');
const app = require('../..');
const Log = require('../../db/models/Log');
const subMinutes = require('date-fns/subMinutes');

describe('GET /는', () => {
    const Logs = [
      {
        logId: 1,
        timestamp: new Date(),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'ERROR',
        logName: 'LEGACY_ERROR',
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
        logLevel: 'ERROR',
        logName: 'LEDGER_ERROR',
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
        logLevel: 'ERROR',
        logName: 'INTERNAL_ERROR',
        logDetail: JSON.stringify({
          message:'internal error detail'
        })
      }
    ];

    before(() => Log.sync({force: true}))
    before(() => Log.bulkCreate(Logs));

    describe('성공 시', () => {
      it('test', (done) => {
          Log.findAll({ raw: true }).then(errorLogs => {
            console.log(errorLogs);
            done();
          })
      });
    });
});
