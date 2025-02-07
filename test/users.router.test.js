import { describe, it, after, beforeEach } from "mocha"
import { expect } from "chai"
import supertest from "supertest"
import fs from "fs"
import { usersService } from "../src/services/index.js"
import { connDB, disconnDB } from "../src/connDB.js"
import { logger } from "../src/utils/index.js"


const requester = supertest("http://localhost:8080")

describe("Pruebas router users", function () {
    this.timeout(8000)

    let userTest
    let filePaths

    before(async () => {
        logger.info = () => { }
        logger.error = () => { }
        await connDB()
    })

    beforeEach(async () => {
        userTest = {
            first_name: "Juanito",
            last_name: "Perez",
            email: `Juanito.perez@test.com`,
            password: "juani123"
        }
        filePaths = Array.from({ length: 6 }, (_, i) => `./test/doc${i + 1}.pdf`)
        filePaths.forEach((path, index) => fs.writeFileSync(path, `Fake doc content ${index + 1}`))
    })

    after(async () => {
        await usersService.deleteMany({ email: /@test\.com$/ })
        filePaths.forEach(path => fs.existsSync(path) && fs.unlinkSync(path))
        fs.unlinkSync("./test/docInvalid.txt")
        await disconnDB()
    })

    describe("Pruebas router users (no requieren id)", () => {

        it("Debe crear un usuario correctamente con POST /api/users", async () => {
            let { body, status } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(200)
            expect(body.payload._id).to.exist
            expect(body.payload.first_name).to.be.eq(userTest.first_name)
        })

        it("No debe permitir crear mascota por falta de nombre con POST /api/users", async () => {
            userTest = { first_name: "", last_name: "Perez", email: `Juanito.perez@test.com`, password: "juani123" }
            let { res, status } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota por falta de apellido con POST /api/users", async () => {
            userTest = { first_name: "Juanito", last_name: "", email: `Juanito.perez@test.com`, password: "juani123" }
            let { res, status } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota por falta de email con POST /api/users", async () => {
            userTest = { first_name: "Juanito", last_name: "Perez", email: ``, password: "juani123" }
            let { res, status } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear mascota por falta de email con POST /api/users", async () => {
            userTest = { first_name: "Juanito", last_name: "Perez", email: `Juanito.perez@test.com`, password: "" }
            let { res, status } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir crear un usuario sin datos obligatorios con POST /api/users", async () => {
            let { res, status } = await requester.post("/api/users").send({})
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("No debe permitir un email inválido con POST /api/users", async () => {
            let invalidEmail = { ...userTest, email: "invalidEmail" }
            let { res, status } = await requester.post("/api/users").send(invalidEmail)
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")

        })

        it("Debe rechazar un usuario con email duplicado con POST /api/users", async () => {
            await requester.post("/api/users").send(userTest)
            let { status, res } = await requester.post("/api/users").send(userTest)
            expect(status).to.be.eq(409)
            expect(res.statusMessage).to.be.eq("Conflict")
        })


        it("Debe retornar un array de usuarios con GET /api/users", async () => {
            let { status, body } = await requester.get("/api/users");
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
            expect(body.payload).to.be.an("array")
        })
    })

    describe("Pruebas router users (requieren id)", () => {
        let userId;

        beforeEach(async () => {
            await usersService.deleteMany({ email: /@test\.com$/ })
            let { body: createdUser } = await requester.post("/api/users").send(userTest)
            userId = createdUser.payload._id;
        })

        it("Debe actualizar un usuario con PUT /api/users/:uid", async () => {
            let { body, status } = await requester.put(`/api/users/${userId}`).send({ first_name: "Jane" })
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
            expect(body.message).to.be.eq("User updated")
        })

        it("Debe eliminar un usuario con DELETE /api/users/:uid", async () => {
            let { body, status } = await requester.delete(`/api/users/${userId}`)
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
            expect(body.message).to.be.eq("User deleted")
        })

        it("Debe retornar error si se intenta obtener un usuario inexistente con GET /api/users/:uid", async () => {
            let { res, status } = await requester.get(`/api/users/000000000000000000001111`);
            expect(status).to.be.eq(404);
            expect(res.statusMessage).to.be.eq("Not Found")
        })

        it("Debe retornar error si se intenta actualizar un usuario inexistente con PUT /api/users/:uid", async () => {
            let { res, status } = await requester.put(`/api/users/000000000000000000001111`).send({ first_name: "Jose" });
            expect(status).to.be.eq(404);
            expect(res.statusMessage).to.be.eq("Not Found")
        });

        it("Debe retornar error si se intenta eliminar un usuario inexistente con DELETE /api/users/:uid", async () => {
            let { res, status } = await requester.delete(`/api/users/000000000000000000001111`);
            expect(status).to.be.eq(404);
            expect(res.statusMessage).to.be.eq("Not Found")
        })

        it("Debe subir documentos correctamente en POST /api/users/:uid/documents", async () => {
            let { body, status } = await requester.post(`/api/users/${userId}/documents`)
                .attach("documents", filePaths[0])
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
        })

        it("Debe subir más de un documento correctamente en POST /api/users/:uid/documents", async () => {
            let { status, body } = await requester.post(`/api/users/${userId}/documents`)
                .attach("documents", filePaths[0])
                .attach("documents", filePaths[1])
            expect(status).to.be.eq(200)
            expect(body.status).to.be.eq("success")
        })

        it("No debe aceptar más de 5 archivos en POST /api/users/:uid/documents", async () => {
            let request = requester.post(`/api/users/${userId}/documents`)
            for (let i = 0; i < filePaths.length; i++) {
                request = request.attach("documents", filePaths[i])
            }
            let { status, res } = await request
            expect(status).to.be.eq(400)
            expect(res.statusMessage).to.be.eq("Bad Request")
        })

        it("Debe aceptar solo tipos de archivos válidos en POST /api/users/:uid/documents", async () => {
            fs.writeFileSync("./test/docInvalid.txt", "Contenido de prueba (en formato TXT)")
            let { res, status } = await requester.post(`/api/users/${userId}/documents`)
                .attach("documents", "./test/docInvalid.txt")
            expect(status).to.be.eq(400);
            expect(res.statusMessage).to.be.eq("Bad Request")
        })


    })
})
