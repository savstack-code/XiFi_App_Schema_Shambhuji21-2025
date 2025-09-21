import appRoot from 'app-root-path';
import { Logger, createLogger, transports, format } from 'winston';

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/log/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger: Logger = createLogger({
  format: format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss A'
    }),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export default logger;