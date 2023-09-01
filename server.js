const express = require('express')
const app = express()
const { Op } = require("sequelize")
const { User, Army, Unit, sequelize } = require('./models')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const sessionStore = require('express-session-sequelize')(session.Store)
const bcrypt = require('bcrypt')
const saltRounds = 10


const sequelizeSessionStore = new sessionStore({
    db: sequelize
});

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "secretpass",
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    resave: true,
    store: sequelizeSessionStore,
    saveUninitialized: true,
}))



app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.post("/register", (req, res) => {
    const { firstName, lastName, email, password, location, favfaction } = req.body

    if (!email || !password) {
        return res.json({ err: "please provide email" });
    }

    let hashedPassword = bcrypt.hashSync(password, saltRounds);

    User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        location: location,
        favfaction: favfaction

    }).then((new_user) => {
        res.json(new_user)
    })
})


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (!user) {
            return res.json({ err: "no user found" });
        }

        console.log(user)

        let comparison = bcrypt.compareSync(password, user.password);
        if (comparison == true) {
            //add routes to send user to usersite
            res.json({ success: true })
        } else {
            res.json({ success: false })
        }
    })
})
//update user email
app.post('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email } = req.body
    const updatedUser = await User.update({ email: email }, {
        where: {
            id: id
        }
    }
    ).then((result) => {
        console.log(result);

        res.json({})
    });;
});
app.listen(3000, () => {
    console.log("server listening on port 3000")
})