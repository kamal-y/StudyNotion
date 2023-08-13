const jsw = require("jsonwebtoken")
const User = require("../models/User")
const { getUser } = require("../routes/authUser")

exports.authUsers = async (req, res, next) => {

    try {

        const token = req.cookies.token || req.body.token ||
            req.header("Authorisation").replace("Bearer ", "")

        if (!token) {
            res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        try {
            const decode = await getUser(token)
            console.log(decode);
            req.user = decode
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next()

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "failed in Authentication"
        })

    }

}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== 'Student') {
            res.status(401).json({
                success: false,
                message: "restricted to Students only"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User role cannot be verified,please try again"
        })
    }
}
exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.role !== 'Instructor') {
            res.status(401).json({
                success: false,
                message: "restricted to Instructor only"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User role cannot be verified,please try again"
        })
    }
}
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'Admin') {
            res.status(401).json({
                success: false,
                message: "restricted to Admin only"
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User role cannot be verified,please try again"
        })
    }
}