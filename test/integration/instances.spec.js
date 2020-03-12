import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import Instance from '../../db/models/Instance';
import Log from '../../db/models/Log';
import mockSites from '../mockData/mockSites';
import mockServices from '../mockData/mockServices';
import mockInstances from '../mockData/mockInstances';
import mockLogs from '../mockData/mockLogs';

describe('Instances API', () => {
  before(() => Site.sync({force: true}))
  before(() => Service.sync({force: true}))
  before(() => Instance.sync({force: true}))
  before(() => Log.sync({force: true}))
  before(() => Site.bulkCreate(mockSites, { logging: false }));
  before(() => Service.bulkCreate(mockServices, { logging: false }));
  before(() => Instance.bulkCreate(mockInstances, { logging: false }));
  before(() => Log.bulkCreate(mockLogs, { logging: false }));

  describe('GET /api/instances/health 는', () => {
      describe('성공 시', () => {
        it('전체 인스턴스 리스트와 각각의 health를 리턴한다.', (done) => {
          request(app)
            .get('/api/instances/health')
            .expect(200)
            .end((err, res) => {
              if(err) done(err);
              // console.log(res.body);
              res.body.result.should.be.instanceOf(Array);
              res.body.result.forEach(e => {
                e.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
                e.name.should.be.instanceOf(String);
                // e.endpoint.should.be.instanceOf(String);
                e.status.should.be.oneOf(true, false);
                // e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
                // e.serviceName.should.be.instanceOf(String);
                e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
                e.siteName.should.be.instanceOf(String);
              });
              done();
            })
        });
      });
  });

  describe('GET /api/instances/:id 는', () => {
    describe('성공 시', () => {
      it('인스턴스 상세정보를 리턴한다.', (done) => {
        request(app)
          .get('/api/instances/1')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);
            
            res.body.result.id.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.name.should.be.instanceOf(String);
            res.body.result.endpoint.should.be.instanceOf(String);
            res.body.result.status.should.be.oneOf(true, false);
            res.body.result.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.serviceName.should.be.instanceOf(String);
            res.body.result.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.siteName.should.be.instanceOf(String);
            done();
          })
      });
    });
    describe('실패 시', () => {
      it('id 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
        request(app)
          .get('/api/instances/noNumber')
          .expect(400, done)
      });

      it('존재하지 않는 instance일 경우, 404을 리턴한다.', (done) => {
        request(app)
          .get('/api/instances/100')
          .expect(404, done)
      });
    });
});
});