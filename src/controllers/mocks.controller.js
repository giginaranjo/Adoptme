import { mockPet, mockUser } from "../dao/mocks.js"
import { petsService, usersService } from "../services/index.js"

const getMockPets = async (req, res) => {

try {
    let { qtyPets = 100 } = req.query
    qtyPets = parseInt(qtyPets)

    if( !qtyPets || qtyPets <= 0 || !Number.isInteger(qtyPets)){
        return res.status(400).send(`Value ${qtyPets} invalid`) 
    }

    let pets = Array.from({length: qtyPets}, () => mockPet())
    return res.status(200).send(pets)

} catch (error) {
    return res.status(500).send(error.message)
}
    
}

const getMockUsers = async (req, res) => {

try {
    let { qtyUsers = 50 } = req.query
    qtyUsers = parseInt(qtyUsers)

    if( !qtyUsers || qtyUsers <= 0 || !Number.isInteger(qtyUsers)){
        return res.status(400).send(`Value ${qtyUsers} invalid`) 
    }

    let users = Array.from({length: qtyUsers}, () => mockUser())
    return res.status(200).send(users)

} catch (error) {
    return res.status(500).send(error.message)
}

}

const generateData = async (req, res) => {

    let {pets: qtyPets = 100, users: qtyUsers = 50} = req.query
    qtyPets = parseInt(qtyPets)
    qtyUsers =parseInt(qtyUsers)


    if( !qtyPets || isNaN(qtyPets) || qtyPets <= 0 ){
        return res.status(400).send(`Value ${qtyPets} invalid`) 
    }

    if( !qtyUsers || isNaN(qtyUsers) || qtyUsers <= 0 ){
        return res.status(400).send(`Value ${qtyUsers} invalid`) 
    }

    try {
        
        let pets = Array.from({length: qtyPets}, () => mockPet())
        await petsService.saveMany(pets)

        let users = Array.from({length: qtyUsers}, () => mockUser())
        await usersService.saveMany(users)

        return res.status(200).send({pets, users})

    } catch (error) {
        return res.status(500).send(error.message)
    }

}

export default {getMockPets, getMockUsers, generateData}