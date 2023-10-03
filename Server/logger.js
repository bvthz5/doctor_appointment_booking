const { createLogger, transports, format } = require('winston');
const { combine, colorize, timestamp, printf, splat, errors } = format;
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(__dirname, 'Log');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logFormat = combine(
    errors({ stack: true }), // Enable logging of stack traces for errors
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    splat(), // Enables the support for string interpolation like console.log
    printf(({ timestamp, level, message, stack }) => {
        let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        if (stack) {
            logMessage += `\n${stack}`;
        }
        return logMessage;
    })
);

const logger = createLogger({
    transports: [
        // Console transport for displaying logs in the console
        new transports.Console({
            format: combine(colorize(), logFormat), // Colorize the log level in the console
            handleExceptions: true, // Log uncaught exceptions
            handleRejections: true, // Log unhandled promise rejections
        }),

        // File transport for storing logs in a file
        new transports.File({
            filename: path.join(logDirectory, 'combined.log'),
            format: logFormat,
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5, // Number of log files to keep
            tailable: true, // Enable log rotation
            zippedArchive: true, // Compress old log files
            // Handle log file rotation manually to avoid multiple transports writing to the same file simultaneously
            rotate: (index) => path.join(logDirectory, `combined.${index}.log`),
            // Clean up log files older than 7 days
            filter: (oldLog) => {
                const datePattern = /\d{4}-\d{2}-\d{2}/;
                const fileDate = oldLog.filename.match(datePattern)[0];
                const currentDate = new Date().toISOString().match(datePattern)[0];
                return currentDate === fileDate || Date.parse(currentDate) - Date.parse(fileDate) <= 7 * 24 * 60 * 60 * 1000;
            },
        }),
    ],
    // Set the log level to 'debug' to log all levels
    level: 'debug',
});

// Add custom log levels for better semantic logging
const customLogLevels = {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5,
};
logger.setLevels(customLogLevels);

// Add custom log level 'critical' for exceptional events
logger.add(new transports.Console({ level: 'critical', format: combine(colorize(), logFormat) }));

// Log uncaught exceptions and unhandled promise rejections
logger.exceptions.handle(
    new transports.File({
        filename: path.join(logDirectory, 'exceptions.log'),
        format: combine(logFormat),
    })
);

module.exports = logger;
