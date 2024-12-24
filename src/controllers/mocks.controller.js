import { mockPet, mockUser } from "../dao/mocks.js"
import { petsService, usersService } from "../services/index.js"
import { CustomError } from "../utils/CustomError.js"
import { EERRORS } from "../utils/EErrors.js"
import { logger } from "../utils/index.js"

const getMockPets = async (req, res, next) => {

try {
    let { pets: qtyPets = 100 } = req.query
    qtyPets = parseInt(qtyPets)

    if( !qtyPets || qtyPets <= 0 || !Number.isInteger(qtyPets)){
        logger.error("Number of pets entered invalid")
        CustomError.createError("Number of pets entered invalid", "Enter a numerical value (not decimal) greater than 0", EERRORS.DATA_TYPES)
    }

    let pets = Array.from({length: qtyPets}, () => mockPet())

    logger.debug(`${qtyPets} pets have been generated`)
    return res.status(200).send(pets)

} catch (error) {
    return next(error)
}
    
}

const getMockUsers = async (req, res, next) => {

try {
    let { users: qtyUsers = 50 } = req.query
    qtyUsers = parseInt(qtyUsers)

    if( !qtyUsers || qtyUsers <= 0 || !Number.isInteger(qtyUsers)){
        logger.error("Number of users entered invalid")
        CustomError.createError("Number of users entered invalid", "Enter a numerical value (not decimal) greater than 0", EERRORS.DATA_TYPES) 
    }

    let users = Array.from({length: qtyUsers}, () => mockUser())

    logger.debug(`${qtyUsers} users have been generated`)
    return res.status(200).send(users)

} catch (error) {
    return next(error)
}

}

const generateData = async (req, res, next) => {

    let {pets: qtyPets = 100, users: qtyUsers = 50} = req.query
    qtyPets = parseInt(qtyPets)
    qtyUsers =parseInt(qtyUsers)


    if( !qtyPets || isNaN(qtyPets) || qtyPets <= 0 ){
        logger.error("Number of pets entered invalid")
        CustomError.createError("Number of pets entered invalid", "Enter a numerical value (not decimal) greater than 0", EERRORS.DATA_TYPES) 
    }

    if( !qtyUsers || isNaN(qtyUsers) || qtyUsers <= 0 ){
        logger.error("Number of users entered invalid")
        CustomError.createError("Number of users entered invalid", "Enter a numerical value (not decimal) greater than 0", EERRORS.DATA_TYPES) 
    }

    try {
        
        let pets = Array.from({length: qtyPets}, () => mockPet())
        await petsService.saveMany(pets)

        let users = Array.from({length: qtyUsers}, () => mockUser())
        await usersService.saveMany(users)

        logger.debug(`${qtyPets} pets and ${qtyUsers} users have been generated`)
        return res.status(200).send({pets, users})

    } catch (error) {
        return next(error)
    }

}

export default {getMockPets, getMockUsers, generateData}