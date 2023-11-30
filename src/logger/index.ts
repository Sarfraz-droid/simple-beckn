import winston from "winston";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),    
        new winston.transports.File({ filename: 'combined.log',
        maxFiles: 1,
        maxsize: 100000,
    })
    ]
})