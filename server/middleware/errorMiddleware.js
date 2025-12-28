//handles errors coming from back end and send them to the front end

//UNSUPPORTED ENDPOINTS

//Because it has three parameters, Express treats it as regular middleware (not an error handler).
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error); //pass error to Express
}

/**notFound is a 404 middleware
Runs only if no route matches
Creates a helpful error message
Sets status code to 404
Passes error to error-handling middleware */

//Error Middleware
const errorHandler = (error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).json({message: error.message || "And unknown error occured."})
}

module.exports = {notFound, errorHandler}