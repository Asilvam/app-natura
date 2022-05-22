const {request, response} = require("express");
const jwt = require("jsonwebtoken");

const validateJwt = (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'invalid token'
        })
    }
    try {
        jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        next()
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            msg: 'invalid token'
        })
    }
    // console.log(token);
    next();
}

module.exports = {
    validateJwt,
}