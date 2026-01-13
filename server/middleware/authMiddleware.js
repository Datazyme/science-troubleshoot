//to check if token is valid and the user is logged in, can get users id
//used to protect protected routes so all protected routes will have this in front of them
const jwt = require('jsonwebtoken')
const HttpError = require('../models/errorModel')

const authMiddleware = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith("Bearer")) {
        const token = Authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if(err)
            {
                return next(new HttpError("Unauthorized. Invalid token", 403))
            }

            req.user = info;
            next()
        })
    } else {
        return next(new HttpError("Unauthorized. No token", 401))
    }
}

module.exports = authMiddleware;

// "Bearer token"