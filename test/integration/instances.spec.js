import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';

describe.only('Instances API', () => {
  describe('GET /api/instances/health 는', () => {
      describe('성공 시', () => {
        it('전체 인스턴스 리스트와 각각의 health를 리턴한다.', (done) => {
          request(app)
            .get('/api/instances/health')
            .expect(200)
            .end((err, res) => {
              if(err) done(err);
  
              res.body.result.should.be.instanceOf(Array);
              res.body.result.forEach(e => {
                e.instanceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
                e.instanceName.should.be.instanceOf(String);
                e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
                e.siteName.should.be.instanceOf(String);
                e.status.should.be.oneOf(true, false);
              });
              done();
            })
        });
      });
  });

  describe('GET /api/instances/:instanceId 는', () => {
    describe('성공 시', () => {
      it('인스턴스 상세정보를 리턴한다.', (done) => {
        request(app)
          .get('/api/instances/1')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);
            
            res.body.result.instanceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.instanceName.should.be.instanceOf(String);
            res.body.result.siteId.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.siteName.should.be.instanceOf(String);
            res.body.result.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(0);
            res.body.result.serviceName.should.be.instanceOf(String);
            res.body.result.endpoint.should.be.instanceOf(String);
            res.body.result.status.should.be.oneOf(true, false);
            done();
          })
      });
    });
    describe('실패 시', () => {
      it('instanceId 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
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