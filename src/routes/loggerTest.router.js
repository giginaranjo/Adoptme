import { Router} from 'express';
import { logger } from '../utils/index.js';


const router = Router();

router.get('/loggerTest', (req, res) => {

    logger.debug("Logger level debug")
    logger.http("Logger level http")
    logger.info("Logger level info")
    logger.warning("Logger level warning")
    logger.error("Logger level error")
    logger.fatal("Logger level fatal")

    res.send("Logs generados")
});


export default router;