const User = require("../models/User")
const { mailSender } = require("../utils/mailSender")
const bcrypt = require("bcrypt")


exports.resetPasswordToken = async (req, res) => {
    try {

        const { email } = req.body.email;

        const user = await User.findOne({ email: email })

        if (!email) {
            res.status(401).json({
                success: false,
                message: "your email is not registered"
            })
        }

        const token = crypto.randomUUID()

        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true })

        const url = `http://localhost:3000/update-password/${token}`

        await mailSender(email, "Password Reset Link", `password reset url link ->${url}`)

        res.status(401).json({
            success: false,
            message: "Email sent Succesfully,please check your mail"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error in creating reset password token"
        })
    }
}

exports.resetPassword =async (req,res)=>{
   try {
    const {password,confirmPassword,token} = req.body

    if(password!==confirmPassword){
        res.status(401).json({
            success: false,
            message: "Password is not matching"
        })
    }

    const userDetails = await User.findOne({token:token})

    if(!userDetails){
        res.status(401).json({
            success: false,
            message: "Token is invalid"
        })
    }

    if(userDetails.resetPasswordExpires < Date.now()){
        res.status(401).json({
            success: false,
            message: "token is expire,pleae regenerate your token"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    await User.findOneAndUpdate({token:token},
                                {
                                    password:hashedPassword
                                })
    res.status(201).json({
        success:false,
        message:"password updated successfully"
    })
    
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "error in reseting password,please try again later"
    })
   }
}