import request from 'supertest';
import should from 'should';
import app from '../..';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import mockSites from '../mockData/mockSites';
import mockServices from '../mockData/mockServices';

describe.only('Sites API', () => {

  before(() => Site.sync({force: true}))
  before(() => Service.sync({force: true}))
  before(() => Site.bulkCreate(mockSites, { logging: false }));
  before(() => Service.bulkCreate(mockServices, { logging: false }));

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

  describe('GET /api/sites 는', () => {
    describe('성공 시', () => {
      it('전체 사이트 리스트를 리턴한다.', (done) => {
        request(app)
          .get('/api/sites')
          .expect(200)
          .end((err, res) => {
            if(err) done(err);

            // console.log(res.body);
            res.body.result.should.be.instanceof(Array);
            res.body.result.forEach(e => {
              e.siteId.should.be.instanceof(Number).and.aboveOrEqual(0);
              e.name.should.be.instanceof(String);
              e.openDate.should.be.instanceof(String).and.match(/^[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/);
              if(e.logoImageName) {
                e.logoImageName.should.be.instanceof(String);
              }
              e.countOfServices.should.be.instanceof(Number).and.aboveOrEqual(0);
            })
            done();
          })
      });
    });
});
});