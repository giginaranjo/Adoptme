import { usersService } from "../services/index.js"
import { CustomError } from "../utils/CustomError.js";
import { EERRORS } from "../utils/EErrors.js";
import { createHash, logger, validEmail } from "../utils/index.js";

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

const createUser = async (req, res, next) => {

    try {
        let { first_name, last_name, email, password } = req.body

        if (!first_name || !last_name|| !email || !password || password == " ") {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }

        if (!validEmail(email)) {
            logger.error("Wrong email format")
            CustomError.createError("Wrong email format", "Please verify email and try again", EERRORS.INVALID_ARGUMENTS)
        }

        let exist = await usersService.getUserByEmail(email)
        if (exist) {
            logger.error("This email is already being used with another account.")
            CustomError.createError("This email is already being used with another account.", "Please check your email and try again or log in.", EERRORS.CONFLICT)
        }

        password = createHash(password)

        let newUser = await usersService.create({ first_name, last_name, email, password })
        
        res.send({ status: "success", payload: newUser })

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
    updateUser, 
    createUser
}