import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';

describe('GET /api/services 는', () => {
    describe('성공 시', () => {
      it('전체 서비스 리스트를 리턴한다.', (done) => {
        request(app)
          .get('/api/services')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            res.body.result.should.be.instanceOf(Array);
            res.body.result.forEach(e => {
              e.siteId.should.be.instanceOf(Number);
              e.siteName.should.be.instanceOf(String);
              e.serviceId.should.be.instanceOf(Number);
              e.serviceName.should.be.instanceOf(String);
              e.role.should.be.oneOf(Role.ISSUER, Role.VERIFIER, Role.VERISSUER);
            });
            done();
          })
      });
    });
});

describe('GET /api/services/count 는', () => {
  describe('성공 시', () => {
    it('전체 서비스 리스트를 리턴한다.', (done) => {
      request(app)
        .get('/api/services/count')
        .expect(200)
        .end((err, res) => {
          if(err) done(err);

          res.body.result.should.be.instanceOf(Number);
          done();
        })
    });
  });
});

describe('GET /api/services/:serviceId/statistic 는', () => {
  describe('성공 시', () => {
    it('서비스의 누적, 금일 통계를 리턴한다.', (done) => {
      request(app)
        .get('/api/services/1/statistic')
        .expect(200)
        .end((err, res) => {
          if(err) done(err);

          res.body.result.cumulativePairwisedid.should.be.instanceOf(Number);
          res.body.result.cumulativeCredentialIssuance.should.be.instanceOf(Number);
          res.body.result.cumulativeCredentialVerification.should.be.instanceOf(Number);
          res.body.result.todayPairwisedid.should.be.instanceOf(Number);
          res.body.result.todayCredentialIssuance.should.be.instanceOf(Number);
          res.body.result.todayCredentialVerification.should.be.instanceOf(Number);
          done();
        })
    });
  });
  describe('실패 시', () => {
    it('serviceId 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
      request(app)
        .get('/api/services/noNumber/statistic')
        .expect(400, done)
    });
  });
});