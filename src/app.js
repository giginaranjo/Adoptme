import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerTest from './routes/loggerTest.router.js';
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { middLogger, logger} from './utils/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const optionsDoc = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "Documentation API",
            version: "1.0.0",
            description: "Documentation API"
        }
    },
    apis:["./src/docs/*.yaml"]
}
const specs = swaggerJSDoc(optionsDoc)

app.use(middLogger)
const PORT = config.PORT||8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);
app.use('/api/logg',mocksRouter);
app.use('/', loggerTest);
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('Active server');
})

app.use(errorHandler);

const server=app.listen(PORT,()=>{
    logger.debug(`Server escuchando en puerto ${PORT}`)
});

connDB()