import { Router } from "express";
import morgan from "morgan";
import logger from "../config/winston.logger"

class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}

export const handlelogs = (router: Router) =>
router.use(morgan("combined", { stream: new LoggerStream() }));
