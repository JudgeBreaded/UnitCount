const express = require('express')
const app = express()
const { Op } = require("sequelize")
const { User } = require('./models')



app.use(express.json());


app.listen(3000, () => {
    console.log("server listening on port 3000")
})

app.get("/users", (req, res) => {

})

app.post("/login/register", (req, res) => {
    const {firstName, lastName, email, location, favfaction } = req.body
    
    if (!email) {
        return res.json({ err: "please provide email" });
    }
        User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        location: location,
        favfaction: favfaction 

        }).then((new_user) => {
        res.json(new_user)
            })
})