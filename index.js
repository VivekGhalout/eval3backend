const express = require('express');
const { connection } = require('./config/db')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const { Usermodel } = require('./models/user.model');
const { todoRouter } = require("./routes/todo.routes");
const { authentication } = require("./middleware/authmiddleware")

const app = express();

app.use(express.json());
app.use(cors());



// signup
app.post('/signup', async (req, res) => {
    const address = req.socket.localAddress;
    const { name, email, password, ip_Address } = req.body
    const user = await Usermodel.findOne({ email })
    if (user) {
        res.send("User already exist")
    } else {
        const hash_pass = bcrypt.hashSync(password, 6);
        const new_user = new Usermodel({
            name,
            email,
            password: hash_pass,
            ip_Address: address
        })
        await new_user.save();
        res.status(201).send("Signup Successfull")
    }

})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Usermodel.findOne({ email })
    if (!user) {
        res.status(204).send("Login First")
    }
    const hash = user.password;
    const chk_password = bcrypt.compareSync(password, hash);
    if (chk_password) {
        const token = jwt.sign({ userID: user._id }, process.env.MY_SECRET);
        res.send({ "msg": token })
    } else {
        res.status(400).send("Login Failed");
    }
})


app.use("/todos", authentication, todoRouter)

app.listen(8080, async () => {
    try {
        await connection;
        console.log('connected to database')
    } catch (error) {
        console.log('error while connecting db')
    }
    console.log('server started on 8080')
})

