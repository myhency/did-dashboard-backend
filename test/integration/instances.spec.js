import request from 'supertest';
import should from 'should';
import app from '../..';
import Role from '../../enums/Role';

describe('Instances API', () => {
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
                e.siteName.should.be.instanceOf(String);
                e.status.should.be.oneOf(true, false);
              });
              done();
            })
        });
      });
  });
});