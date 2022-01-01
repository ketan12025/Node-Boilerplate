/* eslint-disable no-use-before-define */
/* eslint-disable no-unreachable */
/* eslint-disable no-process-exit */
import http from 'http';
import app from '../app.js';
import logger from '../config/logger.js';

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	logger.error(err.name, err.message);
	// eslint-disable-next-line no-process-exit
	process.exit(1);
});

function normalizePort(val) {
	const port = parseInt(val, 10);

	// eslint-disable-next-line no-restricted-globals
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
const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer(app);
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
	console.log('error', error);
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	switch (error.code) {
		case 'EACCES':
			logger.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.error(`${bind} + is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`;

	logger.info(`Listening on ${bind}`);
}

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
	logger.error(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
	console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('💥 Process terminated!');
		logger.info('💥 Process terminated!');
	});
});

export default server;
