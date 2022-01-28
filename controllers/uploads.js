const {response} = require("express");

const loadFile = (req, res = response) => {
    res.json({
        msg: 'respuesta loadfile'
    })
}

module.exports = {
    loadFile
}