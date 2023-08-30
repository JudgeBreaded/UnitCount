const express = require('express')
const app = express()
const { Op } = require("sequelize")
const { User, Army, Unit } = require('./models')



app.use(express.json());


app.listen(3000, () => {
    console.log("server listening on port 3000")
})

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

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

app.post('/users/:id', async (req, res) => {
    const { id } = req.params;
    
    // Assuming that `req.body` is limited to
    // the keys firstName, lastName, and email
    const updatedUser = await User.update(req.body, {
    where: {
        id
    }
    });
    
    res.json(updatedUser);
});