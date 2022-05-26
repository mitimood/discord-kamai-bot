const winston = require('winston')
const { format, transports } = winston
const path = require('path')
const { readdirSync, unlinkSync   } = require('fs')


const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

const date = new Date().valueOf()

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Format the metadata object
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', "path"] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    new transports.File({
      filename: `utils/logs/${date}.log`,
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.prettyPrint()
      )
    })
  ],
  exitOnError: false
})

const logsExpired = readdirSync('./utils/logs').slice(0,-5)

// Clean the log dir
logsExpired.forEach(d=>{
  try {
    unlinkSync('./utils/logs/'+d)
  } catch (error) {
    logger.error(error)
  }

})

process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err);
});

module.exports = logger