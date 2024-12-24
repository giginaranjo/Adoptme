import bcrypt from 'bcrypt';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import winston from 'winston';
import { config } from '../config/config.js';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const passwordValidation = (password, hash) => bcrypt.compareSync(password, hash)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const customLevels = {
    levels: {debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0},
    colors: {debug: "blue", http: "magenta", info: "green", warning: "yellow", error: "red", fatal: "black"}
}

export const logger = winston.createLogger({
    levels: customLevels.levels,
    transports:[
        new winston.transports.Console({
            level: config.MODE === "dev" ? "debug" : "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }), 
                winston.format.timestamp(), 
                winston.format.simple()
            )
        }), 
        new winston.transports.File({
            level:"error", 
            filename: "./src/logs/errors.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
})

export const middLogger=(req, res, next)=>{
    req.logger=logger
    next()
}