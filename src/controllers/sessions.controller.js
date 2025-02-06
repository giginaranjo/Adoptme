import { usersService } from "../services/index.js";
import { createHash, logger, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { CustomError } from "../utils/CustomError.js";
import { EERRORS } from "../utils/EErrors.js";

const register = async (req, res, next) => {

    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }

        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            logger.error("User already exists")
            CustomError.createError("User already exists", "Please verify user and try again", EERRORS.CONFLICT)
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);

        logger.debug("User created successfully")
        res.send({ status: "success", payload: result._id });

    } catch (error) {
        return next(error)
    }
}

const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }
        const user = await usersService.getUserByEmail(email);

        if (!user) {
            logger.error("User doesn't exist")
            CustomError.createError("User doesn't exist", "Please verify the data and try again", EERRORS.NOT_FOUND)
        }

        const isValidPassword = await passwordValidation(user, password);

        if (!isValidPassword) {
            logger.error("Incorrect credentials")
            CustomError.createError("Incorrect credentials", "Please verify the data and try again", EERRORS.UNAUTHORIZED)
        }

        await usersService.update(user._id, { last_connection: new Date() });

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

        logger.debug("Successful login")
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" })

    } catch (error) {
        return next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie'];
        if (!cookie) {
            logger.error("No active session found");
            CustomError.createError("Not found", "No active session found", EERRORS.UNAUTHORIZED)
        }

        const user = jwt.verify(cookie, 'tokenSecretJWT');
        await usersService.update(user._id, { last_connection: new Date() });

        res.clearCookie('coderCookie').send({ status: "success", message: "Logged out" });

    } catch (error) {
        return next(error);
    }
};

const current = async (req, res, next) => {
    
    try {
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        if (user) {
            logger.debug("status: success")
            return res.send({ status: "success", payload: user })
        }

    } catch (error) {
        return next(error)
    }

}

const unprotectedLogin = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }
        const user = await usersService.getUserByEmail(email);

        if (!user) {
            logger.error("User doesn't exist")
            CustomError.createError("User doesn't exist", "Please verify the data and try again", EERRORS.NOT_FOUND)
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            logger.error("Incorrect credentials")
            CustomError.createError("Incorrect credentials", "Please verify the data and try again", EERRORS.UNAUTHORIZED)
        }

        const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });

        logger.debug("Unprotected Logged in")
        res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })

    } catch (error) {
        return next(error)
    }

}

const unprotectedCurrent = async (req, res, next) => {

    try {
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user) {
            logger.debug("status: success")
            return res.send({ status: "success", payload: user })
        }

    } catch (error) {
        return next(error)
    }

}

export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent,
    logout
}