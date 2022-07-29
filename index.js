// import express from "express";
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");


const app = express();
const port = process.env.port || 6969
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://adarsh:adarsh@cluster0.o0dnsga.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("connected to DB")
})


//user schema 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//routes routes
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add all fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            console.log(savedUser);
            if (!savedUser) {
                return res.status(422).json({ error: "invalid email or password" })
            } else {
                if (password === savedUser.password) {
                    res.status(200).send({ msg: "login success", user: savedUser })
                } else {
                    res.status(422).send({ msg: "wrong credentials" })
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })

})



app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ msg: 'Name, Password and email are required' })
    }
    User.findOne({ email })
        .then(async (savedUser) =>  {
            if (savedUser) {
                return res.status(422).json({ error: "email already exists" })
            }

            const user  = new User( {
                email,
                password,
                name,
            })
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                


            user.save()
                .then((user) => {
                    res.json({ msg: "user saved successfully" })
                })
                .catch((err) => {
                    console.log(err);
                })
        }).catch((err) => {
            console.log(err);
        })

})


app.get("/", (req, res) => {
    res.send(" server working")
})

app.listen(port, () => {
    console.log("started")
})