import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';
import Log from '../../db/models/Log';
import mockLogs from '../mockData/mockLogs';

describe('Services API', () => {
  before(() => Log.sync({force: true}))
  before(() => Log.bulkCreate(mockLogs));

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
                e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
                e.siteName.should.be.instanceOf(String);
                e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
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
      it('전체 서비스 카운트를 리턴한다.', (done) => {
        request(app)
          .get('/api/services/count')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);
            // console.log(res.body);
            res.body.result.should.be.instanceOf(Number).and.aboveOrEqual(0);
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
            // console.log(res.body);
            res.body.result.cumulativePairwisedid.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.cumulativeCredentialIssuance.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.cumulativeCredentialVerification.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.todayPairwisedid.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.todayCredentialIssuance.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.todayCredentialVerification.should.be.instanceOf(Number).and.aboveOrEqual(0);
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
  
  describe('GET /api/services/:serviceId/transition 는', () => {
    describe('성공 시', () => {
      it('최근 24시간동안 서비스에서 발생한 발급/검증 카운트를 1시간 주기로하여 배열을 리턴한다.', (done) => {
        request(app)
          .get('/api/services/1/transition')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);
            // console.log(res.body);
            res.body.result.should.be.instanceOf(Array).and.have.lengthOf(24);
            res.body.result.forEach(e => {
              e.timestamp.should.be.instanceOf(String).and.match(/^[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9] ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
              e.issuance.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.verification.should.be.instanceOf(Number).and.aboveOrEqual(0);
            });
            done();
          })
      });
    });
    
    describe('실패 시', () => {
      it('serviceId 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
        request(app)
          .get('/api/services/noNumber/transition')
          .expect(400, done)
      });
    });
  });

})
