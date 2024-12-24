export const errorHandler = (error, req, res, next) => {

    if (error.custom) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(error.code).json({error: `${error.name}: ${error.message}`})

    } else{
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Unexpected server error. Try later. ${error.message}`})
    }
}