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