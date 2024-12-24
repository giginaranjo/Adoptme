import { usersService } from "../services/index.js"
import { CustomError } from "../utils/CustomError.js";
import { EERRORS } from "../utils/EErrors.js";
import { logger } from "../utils/index.js";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAll();

        logger.debug("All pets were successfully obtained")
        res.send({ status: "success", payload: users })

    } catch (error) {
        return next(error)
    }

}

const getUser = async (req, res, next) => {

    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if (!user) {
            logger.error("There is no user with the ID entered")
            CustomError.createError("There is no user with the ID entered", "Please verify ID and try again", EERRORS.NOT_FOUND)
        }
        logger.debug("User obtained successfully")
        res.send({ status: "success", payload: user })

    } catch (error) {
        return next(error)
    }

}

const updateUser = async (req, res, next) => {

    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if (!user) {
            logger.error("There is no user with the ID entered")
            CustomError.createError("There is no user with the ID entered", "Please verify ID and try again", EERRORS.NOT_FOUND)
        }

        logger.debug("User updated successfully")
        const result = await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" })

    } catch (error) {
        return next(error)
    }

}

const deleteUser = async (req, res, next) => {

    try {
        const userId = req.params.uid;
        const result = await usersService.getUserById(userId);

        logger.debug("User deleted successfully")
        res.send({ status: "success", message: "User deleted" })

    } catch (error) {
        return next(error)
    }

}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}