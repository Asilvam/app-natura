const {response} = require("express")

const validateFileUp = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'there is not file to up - validateFileUp'
        });
    }
    next();
}

module.exports = {
    validateFileUp
}
