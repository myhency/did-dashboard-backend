import request from 'supertest';
import should from 'should';
import app from '../../';
import Log from '../../db/models/Log';
import mockLogs from '../mockData/mockLogs';

describe('GET /overview/errors/count 는', () => {
    
    before(() => Log.sync({force: true}))
    before(() => Log.bulkCreate(mockLogs));

    describe('성공 시', () => {
      it('최근 60분의 에러 카운트를 리턴한다.', (done) => {
        request(app)
          .get('/overview/errors/count')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);
            res.body.result.should.equal(3);
            done();
          })
      });
    });
});

describe('GET /overview/apicalls/count 는', () => {
    
  before(() => Log.sync({force: true}))
  before(() => Log.bulkCreate(mockLogs));

  describe('성공 시', () => {
    it('최근 60분의 API Call 카운트를 리턴한다.', (done) => {
      request(app)
        .get('/overview/apicalls/count')
        .expect(200)
        .end((err, res) => {
          if(err) done(err);
          res.body.result.should.equal(1);
          done();
        })
    });
  });
});