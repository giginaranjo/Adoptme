import swaggerJSDoc from 'swagger-jsdoc';

export const optionsDoc = {
    definition:{
        openapi: "3.0.0",
        info:{
            title: "Documentation API - Adoptme",
            version: "1.0.0",
            description: "Documentation API - Adoptme"
        }
    },
    apis:["./src/docs/*.yaml"]
}

export const specs = swaggerJSDoc(optionsDoc)

export default { specs }