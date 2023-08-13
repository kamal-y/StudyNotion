const jsw = require("jsonwebtoken")
require("dotenv").config()

exports.setUser = (payload) => {
    return jsw.sign(payload, process.env.JWT_TOKEN, {
        expiresIn: '2h',
    })
}

exports.getUser = (token) => {
    return jsw.verify(token, process.env.JWT_TOKEN)
}