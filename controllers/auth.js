const {response} = require("express");
const User = require('../models/usuario');
const bcryptjs = require("bcryptjs");
const {generateJWT} = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
    const {email, password} = req.body;
    // console.log(email, password);
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({msg: 'email fail'})
        }
        if (!user.isActive) {
            return res.status(400).json({msg: 'state fail'})
        }
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({msg: 'password fail'})
        }
        const token = await generateJWT(user._id);
        res.json({
            user,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({msg: 'Error Login'})
    }


}

module.exports = {
    login
}