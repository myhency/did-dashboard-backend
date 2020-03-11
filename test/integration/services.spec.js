import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';
import Service from '../../db/models/Service';
import Instance from '../../db/models/Instance';
import Log from '../../db/models/Log';
import mockServices from '../mockData/mockServices';
import mockInstances from '../mockData/mockInstances';
import mockLogs from '../mockData/mockLogs';
import { format } from 'date-fns';
import Constants from '../../constants';

describe('Services API', () => {
  before(() => Service.sync({force: true}))
  before(() => Instance.sync({force: true}))
  before(() => Log.sync({force: true}))
  before(() => Service.bulkCreate(mockServices, { logging: false }));
  before(() => Instance.bulkCreate(mockInstances, { logging: false }));
  before(() => Log.bulkCreate(mockLogs, { logging: false }));

  describe('GET /api/services 는', () => {
    describe('성공 시', () => {
      it('전체 서비스 리스트를 리턴한다.', (done) => {
        request(app)
          .get('/api/services')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            // console.log(res.body.result);
            res.body.result.should.be.instanceOf(Array);
            res.body.result.forEach(e => {
              e.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.name.should.be.instanceOf(String);
              e.role.should.be.oneOf(Role.ISSUER, Role.VERIFIER, Role.VERISSUER);
              e.openDate.should.be.instanceOf(String).and.match(Constants.DATE_FORMAT_REGEX);
              e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.siteName.should.be.instanceOf(String);
              e.countOfInstances.should.be.instanceOf(Number).and.aboveOrEqual(0);
            });
            done();
          })
      });

      it('사이트로 검색 시, 해당 사이트 내 서비스 리스트를 리턴한다.', (done) => {
        const searchSiteId = 1;

        request(app)
          .get('/api/services')
          .query({
            siteId: searchSiteId
          })
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            // console.log(res.body.result);
            res.body.result.should.be.instanceOf(Array);
            res.body.result.forEach(e => {
              e.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.name.should.be.instanceOf(String);
              e.role.should.be.oneOf(Role.ISSUER, Role.VERIFIER, Role.VERISSUER);
              e.openDate.should.be.instanceOf(String).and.match(Constants.DATE_FORMAT_REGEX);
              e.siteId.should.be.instanceOf(Number).and.equal(searchSiteId);
              e.siteName.should.be.instanceOf(String);
              e.countOfInstances.should.be.instanceOf(Number).and.aboveOrEqual(0);
            });
            done();
          })
      });

      it('Role로 검색 시, 해당 Role을 가진 서비스 리스트를 리턴한다.', (done) => {
        const searchRole = Role.ISSUER;

        request(app)
          .get('/api/services')
          .query({
            role: searchRole
          })
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            // console.log(res.body.result);
            res.body.result.should.be.instanceOf(Array);
            res.body.result.forEach(e => {
              e.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.name.should.be.instanceOf(String);
              e.role.should.be.equal(searchRole);
              e.openDate.should.be.instanceOf(String).and.match(Constants.DATE_FORMAT_REGEX);
              e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.siteName.should.be.instanceOf(String);
              e.countOfInstances.should.be.instanceOf(Number).and.aboveOrEqual(0);
            });
            done();
          })
      });

      it('Open Date 시작일/끝일으로 검색 시, Open Date 기간 내에 있는 서비스 리스트를 리턴한다.', (done) => {
        const searchOpenDateStart = format(new Date(2018, 0, 1), Constants.DATE_FORMAT);
        const searchOpenDateEnd = format(new Date(2019, 1, 28), Constants.DATE_FORMAT);

        request(app)
          .get('/api/services')
          .query({
            openDateStart: searchOpenDateStart,
            openDateEnd: searchOpenDateEnd
          })
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            // console.log(res.body.result);
            res.body.result.should.be.instanceOf(Array);
            res.body.result.forEach(e => {
              e.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.name.should.be.instanceOf(String);
              e.role.should.be.oneOf(Role.ISSUER, Role.VERIFIER, Role.VERISSUER);
              e.openDate.should.be.instanceOf(String).and.match(Constants.DATE_FORMAT_REGEX)
                .and.greaterThanOrEqual(searchOpenDateStart)
                .and.lessThanOrEqual(searchOpenDateEnd);
              e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
              e.siteName.should.be.instanceOf(String);
              e.countOfInstances.should.be.instanceOf(Number).and.aboveOrEqual(0);
            });
            done();
          })
      });
    });

    describe('실패 시', () => {
      it('잘못된 Role로 검색 시, 400을 리턴한다.', (done) => {
        const searchRole = 'NoRole';

        request(app)
          .get('/api/services')
          .query({
            role: searchRole
          })
          .expect(400)
          .end(done);
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
  
  describe('GET /api/services/:id/statistic 는', () => {
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
      it('존재하지 않는 service라면 404을 리턴한다.', (done) => {
        request(app)
          .get('/api/services/100/statistic')
          .expect(404, done)
      });
    });
  });
  
  describe('GET /api/services/:id/transition 는', () => {
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
              e.timestamp.should.be.instanceOf(String).and.match(Constants.DATETIME_FORMAT_REGEX);
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
      it('존재하지 않는 service라면 404을 리턴한다.', (done) => {
        request(app)
          .get('/api/services/100/transition')
          .expect(404, done)
      });
    });
  });

})
