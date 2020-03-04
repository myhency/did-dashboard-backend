import request from 'supertest';
import should from 'should';
import app from '../..';

describe('GET /api/sites/count 는', () => {

    describe('성공 시', () => {
      it('전체 사이트 개수를 리턴한다.', (done) => {
        request(app)
          .get('/api/sites/count')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            res.body.result.should.be.instanceof(Number).and.aboveOrEqual(0);
            done();
          })
      });
    });
});