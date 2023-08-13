const express = require("express")
const app = express()

require("dotenv").config();
PORT = process.env.PORT || 4000;

app.use(express.json())


const { connectDB } = require("./config/database")
connectDB()

app.get("/", (req, res) => { res.send("<h1>This is a HomePage</h1>") })

app.listen(PORT, () => {
    console.log("server started at port ",PORT);
})