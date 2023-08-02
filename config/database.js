const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to the database at port ->',process.env.PORT);
        })
        .catch((err) => {
            console.error('Error connecting to the database:', err.message);
        });

};

module.exports = {connectDB};