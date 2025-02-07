import mongoose from "mongoose";
import { config } from "./config/config.js";
import { logger } from "./utils/index.js";

export const connDB = async () => {
    try {
        await mongoose.connect(
            config.URL_MONGO,
            { dbName: config.DB_NAME }
        )
        logger.info("DB connected");

    } catch (error) {
        logger.error(`Error connecting to DB: ${error.message}`);
    }
}

export const disconnDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info("DB disconnected");
    } catch (error) {
        logger.error(`Error disconnecting to DB: ${error.message}`);
    }
};
