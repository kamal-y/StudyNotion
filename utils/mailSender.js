const { model } = require("mongoose");
const nodemailer = require("nodemailer")
require("dotenv").config()

const mailSender = async (email,title,body) =>{
    try {
        
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        const mailOptions = {
            from: 'KAMAL YADAV',
            to:`${email}`,
            subject:`${title}`,
            html:`otp is ->${body}`
          };

        let info = await transporter.sendMail(mailOptions)

        console.log('info -->', info);
        return info;
    } catch (error) {
        console.error('Error sending email in mailSender utils:', error);
    }
}

model.exports = mailSender;