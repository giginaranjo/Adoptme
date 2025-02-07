import { fakerES_MX as faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';
import { config } from '../config/config.js';

export const mockPet = () => {

    let name = faker.animal.petName()
    let specie = faker.animal.type()
    let birthDate = faker.date.birthdate()
    let adopted = false
    let owner = null
    let image = faker.image.urlLoremFlickr({ category: 'animals' })

    return { name, specie, birthDate, adopted, owner, image }
}

export const mockUser = () => {

    let first_name = faker.person.firstName()
    let last_name = faker.person.lastName()
    let email = faker.internet.email({ firstName: first_name, lastName: last_name })
    let password = config.PASSWORD
    password = createHash(password)
    let role = "user"
    let pets = []
    let documents = []
    let last_connection = faker.date.past()

    return { first_name, last_name, email, password, role, pets, documents, last_connection }

}