import request from 'supertest';
import should, { fail } from 'should';
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
    before(() => Site.sync({ force: true }))
    before(() => Service.sync({ force: true }))
    before(() => Instance.sync({ force: true }))
    before(() => Log.sync({ force: true }))
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
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.should.be.instanceOf(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.name.should.be.instanceOf(String);
                            // e.endpoint.should.be.instanceOf(String);
                            e.status.should.be.oneOf(true, false);
                            // e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            // e.serviceName.should.be.instanceOf(String);
                            e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(1);
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
                        if (err) return done(err);

                        res.body.result.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                        res.body.result.name.should.be.instanceOf(String);
                        res.body.result.endpoint.should.be.instanceOf(String);
                        res.body.result.status.should.be.oneOf(true, false);
                        res.body.result.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                        res.body.result.serviceName.should.be.instanceOf(String);
                        res.body.result.siteId.should.be.instanceOf(Number).and.aboveOrEqual(1);
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

    describe('GET /api/instances 는', () => {
        describe('성공 시', () => {
            it('전체 인스턴스 리스트를 리턴한다.', (done) => {
                request(app)
                    .get('/api/instances')
                    .query({
                        perPage: 10,
                        page: 1,
                        sort: 'siteName asc,serviceName desc,name asc,endpoint desc,status asc'
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceOf(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.name.should.be.instanceOf(String);
                            e.endpoint.should.be.instanceOf(String);
                            e.status.should.be.oneOf(true, false);
                            e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceOf(String);
                            e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceOf(String);
                        });
                        done();
                    })
            });

            it('사이트로 검색 시, 사이트에 속한 인스턴스 리스트를 리턴한다.', (done) => {
                const searchSiteId = 1;

                request(app)
                    .get('/api/instances')
                    .query({
                        siteId: searchSiteId
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceOf(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.name.should.be.instanceOf(String);
                            e.endpoint.should.be.instanceOf(String);
                            e.status.should.be.oneOf(true, false);
                            e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceOf(String);
                            e.siteId.should.be.instanceOf(Number).and.equal(searchSiteId);
                            e.siteName.should.be.instanceOf(String);
                        });
                        done();
                    })
            });

            it('서비스로 검색 시, 서비스에 속한 인스턴스 리스트를 리턴한다.', (done) => {
                const searchServiceId = 1;

                request(app)
                    .get('/api/instances')
                    .query({
                        serviceId: searchServiceId
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceOf(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.name.should.be.instanceOf(String);
                            e.endpoint.should.be.instanceOf(String);
                            e.status.should.be.oneOf(true, false);
                            e.serviceId.should.be.instanceOf(Number).and.equal(searchServiceId);
                            e.serviceName.should.be.instanceOf(String);
                            e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceOf(String);
                        });
                        done();
                    })
            });

            it('상태로 검색 시, 해당 상태를 가진 인스턴스 리스트를 리턴한다.', (done) => {
                const searchStatus = false;

                request(app)
                    .get('/api/instances')
                    .query({
                        status: searchStatus
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceOf(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.name.should.be.instanceOf(String);
                            e.endpoint.should.be.instanceOf(String);
                            e.status.should.be.equal(searchStatus);
                            e.serviceId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceOf(String);
                            e.siteId.should.be.instanceOf(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceOf(String);
                        });
                        done();
                    })
            });
        });

        describe('실패 시', () => {
            it('잘못된 포맷의 사이트로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/instances')
                    .query({
                        siteId: 'noSiteId'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 서비스로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/instances')
                    .query({
                        serviceId: 'noServiceId'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 상태로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/instances')
                    .query({
                        status: 'noStatus'
                    })
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe('DELETE /api/instances/:id 는', () => {
        describe('성공 시', () => {
            it('인스턴스를 삭제하고, 204를 리턴한다.', (done) => {
                request(app)
                    .delete('/api/instances/5')
                    .expect(204)
                    .end(done);
            });
        });

        describe('실패 시', () => {
            it('id 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
                request(app)
                    .delete('/api/instances/noNumber')
                    .expect(400, done)
            });
            it('존재하지 않는 인스턴스라면 404을 리턴한다.', (done) => {
                request(app)
                    .delete('/api/instances/100')
                    .expect(404, done)
            });
        });
    });

    describe('POST /api/instances 는', () => {
        describe('성공 시', () => {
            it('인스턴스를 추가하고, 인스턴스 id와 함께 201를 리턴한다.', (done) => {
                request(app)
                    .post('/api/instances')
                    .send({
                        serviceId: 4,
                        name: '새로운 인스턴스',
                        endpoint: 'http://123.456.7.890:8080'
                    })
                    .expect(201)
                    .end((err, res) => {
                        if(err) return done(err);

                        res.body.result.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                        done();
                    });
            });
        });

        describe('실패 시', () => {
            it('잘못된 포맷의 서비스를 입력할 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/instances')
                    .send({
                        serviceId: 'noServiceId',
                        name: '새로운 인스턴스',
                        endpoint: 'http://123.456.7.890:8080'
                    })
                    .expect(400, done)
            });
            it('잘못된 포맷의 인스턴스명을 입력할 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/instances')
                    .send({
                        serviceId: 4,
                        name: '   ',
                        endpoint: 'http://123.456.7.890:8080'
                    })
                    .expect(400, done)
            });
            it('잘못된 포맷의 Endpoint를 입력할 시, 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/instances')
                    .send({
                        serviceId: 4,
                        name: '새로운 인스턴스',
                        endpoint: '    '
                    })
                    .expect(400, done)
            });
            it('존재하지 않는 서비스라면 400을 리턴한다.', (done) => {
                request(app)
                    .post('/api/instances')
                    .send({
                        serviceId: 100,
                        name: '새로운 인스턴스',
                        endpoint: 'http://123.456.7.890:8080'
                    })
                    .expect(400, done)
            });
        });
    });

    describe('PUT /api/instances/:id 는', () => {
        describe('성공 시', () => {
            it('인스턴스를 수정하고, 인스턴스 id와 함께 201를 리턴한다.', (done) => {
                request(app)
                    .put('/api/instances/8')
                    .send({
                        name: '수정 인스턴스',
                        endpoint: 'http://000.456.7.890:8080'
                    })
                    .expect(201)
                    .end((err, res) => {
                        if(err) return done(err);

                        res.body.result.id.should.be.instanceOf(Number).and.aboveOrEqual(1);
                        done();
                    });
            });
        });

        describe('실패 시', () => {
            it('잘못된 포맷의 인스턴스명을 입력할 시, 400을 리턴한다.', (done) => {
                request(app)
                    .put('/api/instances/8')
                    .send({
                        name: '    ',
                        endpoint: 'http://000.456.7.890:8080'
                    })
                    .expect(400, done)
            });
            it('잘못된 포맷의 Endpoint를 입력할 시, 400을 리턴한다.', (done) => {
                request(app)
                    .put('/api/instances/8')
                    .send({
                        name: '수정 인스턴스',
                        endpoint: '    '
                    })
                    .expect(400, done)
            });
            it('존재하지 않는 인스턴스라면 404을 리턴한다.', (done) => {
                request(app)
                    .put('/api/instances/100')
                    .send({
                        name: '수정 인스턴스',
                        endpoint: 'http://000.456.7.890:8080'
                    })
                    .expect(404, done)
            });
        });
    });

});