import app from '../index';
const debug = require('debug')('express-sequelize');
import http from 'http';
import sequelize from '../db/models';
import Log from '../db/models/Log';
import mockLogs from '../test/mockData/mockLogs';

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);

// sequelize options
const options = {
    force: process.env.NODE_ENV === 'local' ? true : false
};

sequelize.sync(options).then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    if(process.env.NODE_ENV === 'local') {
        console.log('Creating Bulk Data ...')
        Log.bulkCreate(mockLogs, {
            logging: false
        });
        console.log('Bulk Data Created.')
    }
});

function normalizePort(val) {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
  
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
  }
  
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}