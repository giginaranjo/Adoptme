import { describe, it, before, after, beforeEach } from "mocha"
import { expect } from "chai"
import supertest from "supertest"
import fs from "fs"
import { petsService } from "../src/services/index.js"
import { connDB, disconnDB } from "../src/connDB.js"
import { logger } from "../src/utils/index.js"

const requester = supertest("http://localhost:8080")

describe("Pruebas router pets", function () {
    this.timeout(8000)

    let petTest

    before(async () => {
        logger.info = () => { }
        logger.error = () => { }
        await connDB()
    })

    beforeEach(async () => {
        petTest = {
            name: "Zuko",
            specie: "Test",
            birthDate: new Date().toUTCString()
        }
    })

    after(async () => {
        await petsService.deleteMany({ specie: /Test/ })
        fs.unlinkSync("./test/image.jpg")
        fs.unlinkSync("./test/imgInvalid.svg")
        await disconnDB()
    })

    describe("Pruebas router pets (no requieren id)", () => {
        it("Debe crear una mascota correctamente con POST /api/pets", async () => {
            let { body, status } = await requester.post("/api/pets").send(petTest)
            expect(status).to.be.eq(200)
            expect(body.payload._id).to.exist
            expect(body.payload.name).to.be.eq(petTest.name)
        })

        it("No debe permitir crear mascota por falta de nombre con POST /api/pets", async () => {
            petTest = { name: "", specie: "Test", birthDate: new Date().toUTCString() }
            let { res, status } = await requester.post("/api/pets").send(petTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota por falta de especie con POST /api/pets", async () => {
            petTest = { name: "Zuko", specie: "", birthDate: new Date().toUTCString() }
            let { res, status } = await requester.post("/api/pets").send(petTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota por falta de fecha de nacimiento con POST /api/pets", async () => {
            petTest = { name: "Zuko", specie: "Test", birthDate: "" }
            let { res, status } = await requester.post("/api/pets").send(petTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear una mascota sin datos obligatorios con POST /api/pets", async () => {
            let { res, status } = await requester.post("/api/pets").send({})
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("Debe retornar un array de mascotas con GET /api/pets", async () => {
            let { status, body } = await requester.get("/api/pets")
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
            expect(body.payload).to.be.an("array")
        })
    })

    describe("Pruebas router pets (requieren id)", () => {

        let petId

        beforeEach(async () => {
            let { body: createdPet } = await requester.post("/api/pets").send(petTest)
            petId = createdPet.payload._id
        })

        it("Debe actualizar una mascota con PUT /api/pets/:pid", async () => {
            let { body, status } = await requester.put(`/api/pets/${petId}`).send({ name: "Zukini" })
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
        })

        it("Debe eliminar una mascota con DELETE /api/pets/:pid", async () => {
            let { body, status } = await requester.delete(`/api/pets/${petId}`)
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
        })

        it("Debe retornar error si se intenta obtener una mascota inexistente con GET /api/pets/:pid", async () => {
            let { res, status } = await requester.get(`/api/pets/000000000000000000001111`)
            expect(status).to.be.eq(404)
            expect(res.statusMessage).to.be.eq("Not Found")
        })

        it("Debe retornar error si se intenta actualizar a una mascota inexistente con PUT /api/pets/:pid", async () => {
            let { res, status } = await requester.put(`/api/pets/000000000000000000001111`).send({ name: "Zukini" })
            expect(status).to.be.eq(404)
            expect(res.statusMessage).to.be.eq("Not Found")
        })

        it("Debe retornar error si se intenta obtener una mascota inexistente con DELETE /api/pets/:pid", async () => {
            let { res, status } = await requester.delete(`/api/pets/000000000000000000001111`)
            expect(status).to.be.eq(404)
            expect(res.statusMessage).to.be.eq("Not Found")
        })

        it("Debe subir una imagen correctamente en POST /api/pets/withimage", async () => {
            fs.writeFileSync("./test/image.jpg", "Imagen de prueba")
            let { body, status } = await requester.post("/api/pets/withimage")
                                                    .field("name", "Bobby")
                                                    .field("specie", "Test")
                                                    .field("birthDate", "2023-05-10")
                                                    .attach("image", "./test/image.jpg")
            expect(status).to.be.eq(200);
            expect(body.status).to.be.eq("success");
            expect(body.payload.image).to.exist
        })

        it("Debe aceptar solo tipos de archivos válidos en POST /api/pets/withimage", async () => {
            fs.writeFileSync("./test/imgInvalid.svg", "Contenido de prueba (en formato SVG)")
            let { status, res } = await requester.post("/api/pets/withimage")
                                                    .field("name", "Bobby")
                                                    .field("specie", "Test")
                                                    .field("birthDate", "2023-05-10")
                                                    .attach("image", "./test/imgInvalid.svg")
            expect(status).to.be.eq(400);
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota sin archivo con POST /api/pets/withimage", async () => {
            let { res, status } = await requester.post("/api/pets/withimage")
                                                    .field("name", "Petunia")
                                                    .field("specie", "Cow")
                                                    .field("birthDate", "2023-05-10");
            expect(status).to.be.eq(400);
            expect(res.statusMessage).to.be.eq("Bad Request");
        });


    })
})
