import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import { CustomError } from "../utils/CustomError.js";
import { EERRORS } from "../utils/EErrors.js";
import __dirname, { logger } from "../utils/index.js";

const getAllPets = async (req, res, next) => {

    try {
        const pets = await petsService.getAll();

        logger.debug("All pets were successfully obtained")
        res.send({ status: "success", payload: pets })

    } catch (error) {
        return next(error)
    }

}

const createPet = async (req, res, next) => {

    try {
        const { name, specie, birthDate } = req.body;

        if (!name || !specie || !birthDate) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);

        logger.debug("Pet successfully added")
        res.send({ status: "success", payload: result })

    } catch (error) {
        return next(error)
    }

}

const updatePet = async (req, res, next) => {

    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);

        logger.debug("Pet updated successfully")
        res.send({ status: "success", message: "pet updated" })

    } catch (error) {
        return next(error)
    }

}

const deletePet = async (req, res, next) => {

    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);

        logger.debug("Pet deleted successfully")
        res.send({ status: "success", message: "pet deleted" });

    } catch (error) {
        return next(error)
    }

}

const createPetWithImage = async (req, res, next) => {

    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;

        if (!name || !specie || !birthDate) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }

        logger.debug(file)
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        logger.debug(pet)
        const result = await petsService.create(pet);

        logger.debug("Pet successfully added")
        res.send({ status: "success", payload: result })

    } catch (error) {
        return next(error)
    }

}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}