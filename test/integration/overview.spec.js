import request from 'supertest';
import should from 'should';
import app from '../../';
import Log from '../../db/models/Log';
import { subMinutes } from 'date-fns';

describe('GET /overview/errors 는', () => {
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
      },
      {
        logId: 4,
        timestamp: subMinutes(new Date(), 3),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'INFO',
        logName: 'API_CALL_INFO',
        logDetail: JSON.stringify({
          message:'api call info'
        })
      },
      {
        logId: 5,
        timestamp: subMinutes(new Date(), 4),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'INFO',
        logName: 'NEW_PAIRWISEDID_INFO',
        logDetail: JSON.stringify({
          message:'new pairwisedid info'
        })
      },
      {
        logId: 6,
        timestamp: subMinutes(new Date(), 5),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'INFO',
        logName: 'CREDENTIAL_ISSUANCE_INFO',
        logDetail: JSON.stringify({
          message:'credential issuance info'
        })
      },
      {
        logId: 7,
        timestamp: subMinutes(new Date(), 6),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'INFO',
        logName: 'CREDENTIAL_VERIFICATION_INFO',
        logDetail: JSON.stringify({
          message:'credential verification info'
        })
      },
      {
        logId: 8,
        timestamp: subMinutes(new Date(), 7),
        siteId: 1,
        serviceId: 1,
        instanceId: 1,
        logLevel: 'INFO',
        logName: 'CREDENTIAL_REVOCATION_INFO',
        logDetail: JSON.stringify({
          message:'credential revocation info'
        })
      }
    ];

    before(() => Log.sync({force: true}))
    before(() => Log.bulkCreate(Logs));

    describe('성공 시', () => {
      it('최근 60분의 에러 카운트를 리턴한다.', (done) => {
        request(app)
          .get('/overview/errors')
          .expect(200)
          .end((err, res) => {
            res.body.result.should.equal(3);
            done();
          })
      });
    });
});
