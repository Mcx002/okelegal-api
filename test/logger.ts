import winston from 'winston'

export const createLoggerTest = () => {
    return winston.createLogger({
        level: 'error',
        transports: [new winston.transports.Console()],
    })
}
