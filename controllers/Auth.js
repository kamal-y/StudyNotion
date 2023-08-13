const User = require("../models/User")
const OTP = require("../models/OTP")
const Profile = require("../models/Profile")
const otpGenerater = require("otp-generator")
const jsw = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {setUser} = require("../routes/authUser")


exports.sendOTP = async (res, req) => {
    try {

        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email: email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already existed"
            })
        }

        //from otp-generator package
        var otp = otpGenerater.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log(otp);

        let result = await OTP.findOne({ otp: otp })

        while (result) {
            otp = otpGenerater.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })

            result = await OTP.findOne({ otp: otp })
        }

        const OtpPayload = { email, otp }

        const otpBody = await OTP.create(OtpPayload)

        console.log(otpBody);

        res.status(201).json({
            status: true,
            message: "OTP Send Successfully",
            otp
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in sending OTP",
            error: error.message
        })
    }
}

exports.signUp = async (req, res) => {
    try {

        const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required!",
                error: error.message
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirmed password does not matched :(",
                error: error.message
            })
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with given email is already existed",
                error: error.message
            })
        }

        const resentOTP = await OTP.find({ email:email }).sort({ createdAt: -1 }).limit(1)

        if (!resentOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
                error: error.message
            })
        }

        if (resentOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP doesn't matched",
                error: error.message
            })
        }

        const HashedPassword = await bcrypt.hash(password, 10)

        const profileDetails = await Profile.create({
            gender: null,
            about: null,
            dateOfBirth: null,
            contactNumber: null
        })

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: HashedPassword,
            additionalDetails: profileDetails._id,
            accountType,
            image: `https://api.dicebar.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(201).json({
            status: true,
            message: "User Created Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in Signing Up",
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const user = await User.findOne({ email: email }).populate("additionalDetails").exec()

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user is not created,please signup first",
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType
            }

            const token = setUser(payload)

            user.toObject()

            user.token = token
            user.password = undefined

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('token', token, options).status(200).json({
                status: true,
                user: user,
                token,
                message: "logged in successfully"
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error in logging in",
            error: error.message
        })
    }
}