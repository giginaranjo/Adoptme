import { adoptionsService, petsService, usersService } from "../services/index.js"
import { CustomError } from "../utils/CustomError.js";
import { EERRORS } from "../utils/EErrors.js";
import { logger } from "../utils/index.js";

const getAllAdoptions = async (req, res, next) => {
    try {
        const result = await adoptionsService.getAll();

        logger.debug("All adoptions were successfully obtained")
        res.send({ status: "success", payload: result })

    } catch (error) {
        return next(error)
    }

}

const getAdoption = async (req, res, next) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId })

        if (!adoption) {
            logger.error("There is no adoption with the ID entered")
            CustomError.createError("There is no adoption with the ID entered", "Please verify ID and try again", EERRORS.NOT_FOUND)
        }

        logger.debug("Adoption successfully obtained")
        res.send({ status: "success", payload: adoption })

    } catch (error) {
        return next(error)
    }

}

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;
        const user = await usersService.getUserById(uid);

        if (!user){
            logger.error("Nonexistent user")
            CustomError.createError("Nonexistent user", "Please verify user and try again", EERRORS.NOT_FOUND)
        }

        const pet = await petsService.getBy({ _id: pid });
        if (!pet){
            logger.error("Nonexistent pet")
            CustomError.createError("Nonexistent pet", "Please verify pet and try again", EERRORS.NOT_FOUND)
        }

        if (pet.adopted){
            logger.error("Pet is already adopted")
            CustomError.createError("Pet is already adopted", "Enter the ID of a pet that is available for adoption", EERRORS.CONFLICT)
        }

        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })

        logger.debug("Successfully adopted pet")
        res.send({ status: "success", message: "Pet adopted" })

    } catch (error) {
        return next(error)
    }

}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}