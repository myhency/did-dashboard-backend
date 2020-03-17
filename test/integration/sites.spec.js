import request from 'supertest';
import should from 'should';
import app from '../..';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import mockSites from '../mockData/mockSites';
import mockServices from '../mockData/mockServices';
import Constants from '../../constants';
import { format } from 'date-fns';

describe('Sites API', () => {

    before(() => Site.sync({ force: true }))
    before(() => Service.sync({ force: true }))
    before(() => Site.bulkCreate(mockSites, { logging: false }));
    before(() => Service.bulkCreate(mockServices, { logging: false }));

    describe('GET /api/sites/count 는', () => {
        describe('성공 시', () => {
            it('전체 사이트 개수를 리턴한다.', (done) => {
                request(app)
                    .get('/api/sites/count')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

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
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(0);
                            e.name.should.be.instanceof(String);
                            e.openDate.should.be.instanceof(String).and.match(Constants.DATE_FORMAT_REGEX);
                            if (e.logoFileName) {
                                e.logoFileName.should.be.instanceof(String);
                            }
                            e.numberOfServices.should.be.instanceof(Number).and.aboveOrEqual(0);
                        })
                        done();
                    })
            });

            it('사이트명으로 검색 시 해당하는 사이트 리스트를 리턴한다.', (done) => {
                request(app)
                    .get('/api/sites')
                    .query({
                        name: ' 현대 '
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.length.should.be.equal(1);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(0);
                            e.name.should.be.instanceof(String);
                            e.openDate.should.be.instanceof(String).and.match(Constants.DATE_FORMAT_REGEX);
                            if (e.logoFileName) {
                                e.logoFileName.should.be.instanceof(String);
                            }
                            e.numberOfServices.should.be.instanceof(Number).and.aboveOrEqual(0);
                        })
                        done();
                    })
            });
        });
    });

    describe('GET /api/sites/:id 는', () => {
        describe('성공 시', () => {
            it('사이트 상세 정보를 리턴한다.', (done) => {
                request(app)
                    .get('/api/sites/1')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(0);
                        res.body.result.name.should.be.instanceof(String);
                        res.body.result.openDate.should.be.instanceof(String).and.match(Constants.DATE_FORMAT_REGEX);
                        if (res.body.result.logoFileName) {
                            res.body.result.logoFileName.should.be.instanceof(String);
                        }
                        done();
                    })
            });
        });
        describe('실패 시', () => {
            it('siteId 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/sites/noNumber')
                    .expect(400, done)
            });
            it('존재하지 않는 사이트라면 404을 리턴한다.', (done) => {
                request(app)
                    .get('/api/sites/100')
                    .expect(404, done)
            });
        });
    });

    describe('DELETE /api/sites/:id 는', () => {
        describe('성공 시', () => {
            it('사이트를 삭제하고, 204를 리턴한다.', (done) => {
                request(app)
                    .delete('/api/sites/4')
                    .expect(204)
                    .end(done);
            });
        });

        describe('실패 시', () => {
            it('사이트에 속한 서비스가 있으면 409을 리턴한다.', (done) => {
                request(app)
                    .delete('/api/sites/1')
                    .expect(409, done)
            });
            it('siteId 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
                request(app)
                    .delete('/api/sites/noNumber')
                    .expect(400, done)
            });
            it('존재하지 않는 사이트라면 404을 리턴한다.', (done) => {
                request(app)
                    .delete('/api/sites/100')
                    .expect(404, done)
            });
        });
    });

    describe('POST /api/sites 는', () => {
        describe('성공 시', () => {
            it('사이트를 추가하고, 사이트 id와 함께 201을 리턴한다.', (done) => {
                request(app)
                    .post('/api/sites')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '새로운사이트')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    // .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(0);

                        done();
                    });
            });

            it('사이트를 추가하고 (로고 첨부), 201을 리턴한다.', (done) => {
                request(app)
                    .post('/api/sites')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '새로운사이트')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(0);

                        done();
                    });
            });
        });

        describe('실패 시', () => {
            it('사이트명 누락 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/sites')
                    .set('Content-Type', 'multipart/form-data')
                    // .field('name', '새로운사이트')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });

            it('Open Date 누락 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/sites')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '새로운사이트')
                    // .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 Open Date 입력 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/sites')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '새로운사이트')
                    .field('openDate', format(new Date(), Constants.DATETIME_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe('PUT /api/sites 는', () => {
        describe('성공 시', () => {
            it('사이트를 수정하고, 사이트 id와 함께 201을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/2')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '수정사이트1')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    // .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(0);

                        done();
                    });
            });

            it('사이트를 수정하고 (로고 첨부), 201을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/3')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '수정사이트2')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(0);

                        done();
                    });
            });
        });

        describe('실패 시', () => {
            it('존재하지 않는 사이트일 시, 404을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/100')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '수정사이트')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(404)
                    .end(done);
            });

            it('사이트명 누락 시, 400을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/2')
                    .set('Content-Type', 'multipart/form-data')
                    // .field('name', '수정사이트')
                    .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });

            it('Open Date 누락 시, 400을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/2')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '수정사이트')
                    // .field('openDate', format(new Date(), Constants.DATE_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 Open Date 입력 시, 400을 리턴한다.', (done) => {
                request(app)
                    .put('/api/sites/2')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', '수정사이트')
                    .field('openDate', format(new Date(), Constants.DATETIME_FORMAT))
                    .attach('logoFile', 'test/file/logo-hyundaicard.jpg')
                    .expect(400)
                    .end(done);
            });
        });
    });
});