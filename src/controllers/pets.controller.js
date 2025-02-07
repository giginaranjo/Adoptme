import mongoose from "mongoose";
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

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            logger.error("Invalid pet ID");
            CustomError.createError("Invalid pet ID", "Pet ID must be a valid number", EERRORS.INVALID_ARGUMENTS)
        }

        if (!petUpdateBody || Object.keys(petUpdateBody).length === 0 || String(Object.values(petUpdateBody)).trim() == "") {
            logger.error("No update data provided");
            CustomError.createError("No update data provided", "Please provide data to update the pet", EERRORS.DATA_TYPES)
        }

        const pet = await petsService.getBy({_id: petId});
        console.log(pet);
        
        if (!pet) {
            logger.error("There is no pet with the ID entered")
            CustomError.createError("There is no pet with the ID entered", "Please verify ID and try again", EERRORS.NOT_FOUND)
        }
        
        const result = await petsService.update({_id: petId}, petUpdateBody);

        logger.debug("Pet successfully updated")
        res.send({ status: "success", message: `Updated pet: ${result}` })

    } catch (error) {
        return next(error)
    }

}

const deletePet = async (req, res, next) => {

    try {
        const petId = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(petId)) {
            logger.error("Invalid pet ID");
            CustomError.createError("Invalid pet ID", "Pet ID must be a valid number", EERRORS.INVALID_ARGUMENTS)
        }
        
        const pet = await petsService.getBy({_id: petId});
        if (!pet) {
            logger.error("There is no pet with the ID entered")
            CustomError.createError("There is no pet with the ID entered", "Please verify ID and try again", EERRORS.NOT_FOUND)
        }

        const result = await petsService.delete({_id: petId});

        logger.debug("Pet deleted successfully")
        res.send({ status: "success", message: "pet deleted" });

    } catch (error) {
        return next(error)
    }

}

const createPetWithImage = async (req, res, next) => {

    try {
        console.log(req.file);
        
        if (!req.file) {
            logger.error("No files uploaded");
            CustomError.createError("No files uploaded", "Please upload at least one document.", EERRORS.DATA_TYPES)
        }
console.log("hola");

        const typesDoc = [ "image/png", "image/jpeg", "image/jpg"]
        
        if (!req.file || !typesDoc.includes(req.file.mimetype)) {
            logger.error("Invalid file type detected.");
            CustomError.createError("Invalid file type", "Allowed types: PNG, JPEG, JPG", EERRORS.INVALID_ARGUMENTS)
        }

        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            logger.error("Incomplete values")
            CustomError.createError("Incomplete values", "Complete the required fields", EERRORS.DATA_TYPES)
        }     
        
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`./src/public/pets/${req.file.filename}`
        });
        console.log(pet);
        
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