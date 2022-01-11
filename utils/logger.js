const winston = require('winston')

const date = Date.now()

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
        winston.format.printf(info => `${info.level}:${[info.timestamp]}: ${info.message}`),
    ),
    transports: [
        new winston.transports.File({ filename: `./utils/logs/${date} error.log`, level: 'error' }),
        new winston.transports.File({ filename: `./utils/logs/${date} info.log`, level: 'info' }),
    ],
});
 
logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));


exports.logger = logger
