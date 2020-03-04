import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import logs from './api/logs';
import sites from './api/sites';
import services from './api/services';
import instances from './api/instances';

const app = express();

if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/logs', logs);
app.use('/api/sites', sites);
app.use('/api/services', services);
app.use('/api/instances', instances);

// app.use((req, res, next) => { // 404 처리 부분
//   res.status(404).send();
// });

app.use((err, req, res, next) => { // 에러 처리 부분
  console.error(err.stack); // 에러 메시지 표시
  res.status(500).send(); // 500 상태 표시 후 에러 메시지 전송
});

module.exports = app;