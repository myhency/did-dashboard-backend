import request from 'supertest';
import should from 'should';
import app from '../..';
import Site from '../../db/models/Site';
import Service from '../../db/models/Service';
import Instance from '../../db/models/Instance';
import Log from '../../db/models/Log';
import mockSites from '../mockData/mockSites';
import mockServices from '../mockData/mockServices';
import mockInstances from '../mockData/mockInstances';
import mockLogs from '../mockData/mockLogs';
import Constants from '../../constants';
import LogLevel from '../../enums/LogLevel';
import LogName from '../../enums/LogName';
import { format } from 'date-fns';

describe('Logs API', () => {
    before(() => Site.sync({ force: true }))
    before(() => Service.sync({ force: true }))
    before(() => Instance.sync({ force: true }))
    before(() => Log.sync({ force: true }))
    before(() => Site.bulkCreate(mockSites, { logging: false }));
    before(() => Service.bulkCreate(mockServices, { logging: false }));
    before(() => Instance.bulkCreate(mockInstances, { logging: false }));
    before(() => Log.bulkCreate(mockLogs, { logging: false }));

    describe('GET /api/logs/error/count 는', () => {
        describe('성공 시', () => {
            it('최근 60분의 에러 카운트를 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs/error/count')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Number).and.aboveOrEqual(0);
                        done();
                    })
            });
        });
    });

    describe('GET /api/logs/info/apicall/transition 는', () => {
        describe('성공 시', () => {
            it('최근 60분 동안의 api call 카운트를 1분 주기로 하여 배열을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs/info/apicall/transition')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array).and.have.lengthOf(60);
                        res.body.result.forEach(e => {
                            e.date.should.match(Constants.TIME_FORMAT_REGEX);
                            e.count.should.be.instanceof(Number).and.aboveOrEqual(0);
                        });
                        done();
                    })
            });
        });
    });

    describe('GET /api/logs 는', () => {
        describe('성공 시', () => {
            it('전체 로그 리스트를 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        perPage: 10,
                        page: 2,
                        sort: "occurredDate desc,siteName asc,serviceName desc,instanceName asc,logLevel desc,logName asc"
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('발생시각 시작/끝으로 검색 시, 해당 기간 내 포함된 로그 리스트를 리턴한다. ', (done) => {
                const searchOccurredDateStart = format(new Date(2019, 0, 1, 0, 0, 0, 0), Constants.DATETIME_FORMAT);
                const searchOccurredDateEnd =  format(new Date(2020, 0, 1, 0, 0, 0, 0), Constants.DATETIME_FORMAT);
                // console.log(searchOccurredDateStart);
                // console.log(searchOccurredDateEnd);

                request(app)
                    .get('/api/logs')
                    .query({
                        occurredDateStart: searchOccurredDateStart,
                        occurredDateEnd: searchOccurredDateEnd
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX)
                                .and.greaterThanOrEqual(searchOccurredDateStart)
                                .and.lessThanOrEqual(searchOccurredDateEnd);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('사이트로 검색 시, 해당 사이트 내에서 발생한 로그 리스트를 리턴한다. ', (done) => {
                const searchSiteId = 1;

                request(app)
                    .get('/api/logs')
                    .query({
                        siteId: searchSiteId
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.equal(searchSiteId);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('서비스로 검색 시, 해당 서비스 내에서 발생한 로그 리스트를 리턴한다. ', (done) => {
                const searchServiceId = 1;

                request(app)
                    .get('/api/logs')
                    .query({
                        serviceId: searchServiceId
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.equal(searchServiceId);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('인스턴스로 검색 시, 해당 인스턴스 내에서 발생한 로그 리스트를 리턴한다. ', (done) => {
                const searchInstanceId = 1;

                request(app)
                    .get('/api/logs')
                    .query({
                        instanceId: searchInstanceId
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.equal(searchInstanceId);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('로그레벨로 검색 시, 해당 로그레벨을 가진 로그 리스트를 리턴한다. ', (done) => {
                const searchLogLevel = LogLevel.ERROR;

                request(app)
                    .get('/api/logs')
                    .query({
                        logLevel: searchLogLevel
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.equal(searchLogLevel);
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('로그명으로 검색 시, 해당 로그명을 가진 로그 리스트를 리턴한다. ', (done) => {
                const searchLogName = LogName.INFO.NEW_PAIRWISEDID_INFO;

                request(app)
                    .get('/api/logs')
                    .query({
                        logName: searchLogName
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1)
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            e.logName.should.be.equal(searchLogName);
                            e.logDetail.should.be.instanceof(String);
                        });
                        done();
                    })
            });

            it('로그디테일로 검색 시, 해당 로그디테일을 가진 로그 리스트를 리턴한다. ', (done) => {
                const searchLogDetail = ' LeGa   ';

                request(app)
                    .get('/api/logs')
                    .query({
                        logDetail: searchLogDetail
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // console.log(res.body);
                        res.body.result.should.be.instanceof(Array);
                        res.body.result.forEach(e => {
                            e.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                            e.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.siteName.should.be.instanceof(String);
                            e.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.serviceName.should.be.instanceof(String);
                            e.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                            e.instanceName.should.be.instanceof(String);
                            e.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                            if (e.logLevel === LogLevel.INFO) {
                                e.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                            } else if (e.logLevel === LogLevel.ERROR) {
                                e.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                            }
                            e.logDetail.should.be.instanceof(String).and.containEql(searchLogDetail.trim().toLowerCase());
                        });
                        done();
                    })
            });
        });

        describe('실패 시', () => {
            it('잘못된 포맷의 발생시각 시작/끝으로 검색 시, 400을 리턴한다.', (done) => {
                const searchOccurredDateStart = format(new Date(2019, 0, 1, 0, 0, 0, 0), Constants.TIME_FORMAT);

                request(app)
                    .get('/api/logs')
                    .query({
                        occurredDateStart: searchOccurredDateStart
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 사이트로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        siteId: 'noSiteId'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 서비스로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        serviceId: 'noServiceId'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 인스턴스로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        instanceId: 'noInstanceId'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 로그레벨로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        logLevel: 'WOW'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 로그명으로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        logName: 'WOW~'
                    })
                    .expect(400)
                    .end(done);
            });

            it('잘못된 포맷의 로그디테일로 검색 시, 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs')
                    .query({
                        logDetail: '123456789012345678901' // 20자 제한
                    })
                    .expect(400)
                    .end(done);
            });
        });
    });

    describe('GET /api/logs/:id 는', () => {
        describe('성공 시', () => {
            it('로그 상세 정보를 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs/1')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        // console.log(res.body);
                        res.body.result.id.should.be.instanceof(Number).and.aboveOrEqual(1);
                        res.body.result.occurredDate.should.match(Constants.DETAIL_DATETIME_FORMAT_REGEX);
                        res.body.result.siteId.should.be.instanceof(Number).and.aboveOrEqual(1);
                        res.body.result.siteName.should.be.instanceof(String);
                        res.body.result.serviceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                        res.body.result.serviceName.should.be.instanceof(String);
                        res.body.result.instanceId.should.be.instanceof(Number).and.aboveOrEqual(1);
                        res.body.result.instanceName.should.be.instanceof(String);
                        res.body.result.logLevel.should.be.oneOf(Object.values(LogLevel).map(logLevel => logLevel));
                        if (res.body.result.logLevel === LogLevel.INFO) {
                            res.body.result.logName.should.be.oneOf(Object.values(LogName.INFO).map(logName => logName));
                        } else if (res.body.result.logLevel === LogLevel.ERROR) {
                            res.body.result.logName.should.be.oneOf(Object.values(LogName.ERROR).map(logName => logName));
                        }
                        res.body.result.logDetail.should.be.instanceof(String);
                        done();
                    })
            });
        });

        describe('실패 시', () => {
            it('id 파라미터가 잘못된 형식이면 400을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs/noNumber')
                    .expect(400, done)
            });
            it('존재하지 않는 로그라면 404을 리턴한다.', (done) => {
                request(app)
                    .get('/api/logs/10000')
                    .expect(404, done)
            });
        });
    });
});