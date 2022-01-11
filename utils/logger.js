const winston = require('winston')

const date = Date.now()

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: `./logs/${date} error.log`, level: 'error' }),
        new winston.transports.File({ filename: `./logs/${date} info.log`, level: 'info' }),
    ],
});
 
logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));


exports.logger = logger
