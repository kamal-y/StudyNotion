const mongoose = require("mongoose")
const { mailSender } = require("../utils/mailSender")

const OTPSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    otp: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }

})

const sendVerificationMail = async (email, otp) => {

    try {

        const mailResponse = await mailSender(email, 'helloo from kamal', otp)
        console.log('Email sent:', mailResponse.response);

    } catch (error) {
        console.error('Error sending email:', error);
    }

}

OTPSchema.pre('save', async function (next) {
    await sendVerificationMail(this.email, this.otp)
    next();
})

module.exports = mongoose.model("OTP", OTPSchema)