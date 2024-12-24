export class CustomError{

    static createError (name, message, code){
        let error = new Error (message)
        error.name = name
        error.code = code
        error.custom = true

        throw error
    }
}