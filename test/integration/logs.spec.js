import request from 'supertest';
import should from 'should';
import app from '../..';
import Log from '../../db/models/Log';
import mockLogs from '../mockData/mockLogs';

describe('GET /api/logs/error/count 는', () => {
    
    before(() => Log.sync({force: true}))
    before(() => Log.bulkCreate(mockLogs));

    describe('성공 시', () => {
      it('최근 60분의 에러 카운트를 리턴한다.', (done) => {
        request(app)
          .get('/api/logs/error/count')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            res.body.result.should.be.instanceof(Number).and.aboveOrEqual(0);
            done();
          })
      });
    });
});

describe('GET /api/logs/info/apicall/transition 는', () => {
    
  before(() => Log.sync({force: true}))
  before(() => Log.bulkCreate(mockLogs));

  describe('성공 시', () => {
    it('최근 60분의 API Call 카운트를 리턴한다.', (done) => {
      request(app)
        .get('/api/logs/info/apicall/transition')
        .expect(200)
        .end((err, res) => {
          if(err) done(err);

          res.body.result.should.be.instanceof(Array).and.have.lengthOf(60);
          res.body.result.forEach(e => {
            e.timestamp.should.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
            e.count.should.be.instanceof(Number).and.aboveOrEqual(0);
          });
          done();
        })
    });
  });
});