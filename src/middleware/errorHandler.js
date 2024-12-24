export const errorHandler = (error, req, res, next) => {

    if (error.custom) {
        console.log(error);

        res.setHeader('Content-Type', 'application/json');
        return res.status(error.code).json({error: `${error.name}:${error.message}`})

    } else{
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({error: `Unexpected server error. Try later. ${error.message}`})
    }
}