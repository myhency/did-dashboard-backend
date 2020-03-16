# did-dashboard-backend

## How to run
### MariaDB install (for Test/Local)
```shell
$ docker run -d \
    -p 3306:3306 \
    -e MYSQL_USER=root \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=did_dashboard \
    --name did-mariadb \
    mariadb \
    --character-set-server=utf8 --collation-server=utf8_general_ci
```

### Test
```shell
$ npm test
```

### Install Rest Client Plugin & Test
- Local Server 실행 후, `http` 폴더 내부의 `*.http` 파일에서 `Send Request`를 통해 각 API 실행 가능

### Run Local Server
```shell
$ npm start
```
or
```shell
$ npm run start:local
```

### Run Development Server
```shell
$ npm run start:dev
```

### Run Production Server
```shell
$ npm run start:prod
```

### Reference
- [Sequelize](https://sequelize.org/v5/)
- [javascript export/import](https://beomy.tistory.com/22)
- [Node.js Error: gyp: no xcode or clt version detected!](https://devsoyoung.github.io/posts/no-xcode/)
- [SuperTest](https://github.com/visionmedia/supertest)
- [Inflearn Node Sample](https://github.com/kwonssy02/inflearn-node-api)
- [Timezone](https://meetup.toast.com/posts/125)
- [Should](https://shouldjs.github.io/#assertion-type)
- [Should tip](https://blog.outsider.ne.kr/774)
- [lodash](https://lodash.com/docs/4.17.15)
- [Commit message](https://meetup.toast.com/posts/106)
    - feat (feature)
    - fix (bug fix)
    - docs (documentation)
    - style (formatting, missing semi colons, …)
    - refactor
    - test (when adding missing tests)
    - chore (maintain)
- [Markdown](https://dooray.com/htmls/guides/markdown_ko_KR.html)
- [MariaDB Docker](https://hub.docker.com/_/mariadb)
- [환경변수 관리](https://velog.io/@public_danuel/process-env-on-node-js)
- [Mocha tip](https://blog.outsider.ne.kr/1129)
- [Express 304](https://huns.me/development/2306)
- [Express file upload #1](https://wayhome25.github.io/nodejs/2017/02/21/nodejs-15-file-upload/)
- [Express file upload #2](https://stackoverflow.com/questions/39265838/express-js-image-upload-and-text-inputs-using-post-method)
- [Express file upload #3](https://appdividend.com/2019/02/14/node-express-image-upload-and-resize-tutorial-example/)
- [Express file upload #4](https://www.tutsmake.com/node-js-express-upload-file-image-example/)
- [express-validator](https://express-validator.github.io/docs/index.html)
- [validator.js](https://github.com/validatorjs/validator.js)
- [Node.js를 ES6 문법으로 써보자](https://jeff-til.tistory.com/entry/Nodejs를-ES6-문법으로-써보자)
- [RESTful API 설계 가이드](https://sanghaklee.tistory.com/57)
- [Multer](https://github.com/expressjs/multer/blob/master/doc/README-ko.md)
- [File Upload란?](http://egloos.zum.com/kaludin/v/2270972)