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