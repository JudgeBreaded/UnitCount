const express = require('express')
const app = express()
const { Op } = require("sequelize")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const sessionStore = require('express-session-sequelize')(session.Store)
const bcrypt = require('bcrypt')
const path = require('path')
const es6Renderer = require('express-es6-template-engine');
const { User, Army, Unit, sequelize } = require('./models')
const { Script } = require('vm')
const req = require('express/lib/request')
const saltRounds = 10




const sequelizeSessionStore = new sessionStore({
    db: sequelize
});

app.engine('html', es6Renderer);
app.set('views', './public/views');
app.set('view engine', 'html');
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
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
app.get('/', async (req, res) => {
    if (req.session.userId) {
        res.redirect('/homepage')
    }
    else {

        res.render('loginTemplate', {
            locals: {
                title: "Welcome!"
            },
            partials: {
                body: 'partials/userLogin',
                script: 'partials/partialScripts/userLoginScript'
            }
        })
    }
})
// Load User Data
app.get("/settings", async (req, res) => {
    User.findByPk(req.session.userId, {

    }).then(User => {
        res.render('userTemplate', {
            locals: {
                title: "Settings",
                username: User.userName,
                email: User.email,
                favfaction: User.favfaction,
                firstName: User.firstName,
                lastName: User.lastName
            },
            partials: {
                body: 'partials/userSettings'
            }
        })
    })
})

//Update User Settings
app.put('/settings', async (req, res) => {
    if (req.session.userId) {
        const { userName, email, firstName, lastName } = req.body;
        const updateFields = {};

        if (userName) {
            updateFields.userName = userName;
        }

        if (email) {
            updateFields.email = email;
        }

        if (firstName) {
            updateFields.firstName = firstName;
        }

        if (lastName) {
            updateFields.lastName = lastName;
        }
        console.log(updateFields)
        await User.update(updateFields,
            { where: { id: req.session.userId } })
            .then((result) => {
                if (result[0] === 1) {
                    console.log('User information updated successfully.');
                    res.json({});
                } else {
                    console.log('User not found or no changes to update.');
                    res.status(404).json({ error: 'User not found or no changes to update.' });
                }
            })
            .catch((error) => {
                console.error('Error updating user information:', error);
                res.status(500).json({ error: 'There was a problem updating your information' });
            });
    } else {
        res.status(401).json({ success: false, message: 'Please login' });
    }
});
// //homepage
app.get("/register", (req, res) => {
    if (!req.session.userId) {
        res.render('loginTemplate', {
            locals: {
                title: "Registration",

            },
            partials: {
                body: 'partials/userRegister',
                script: 'partials/partialScripts/userRegisterScript'
            }
        })
    } else {
    res.redirect('/homepage')
}
})
// Creates new user 
app.post("/register", (req, res) => {
    const { firstName, lastName, username, email, password, location, favfaction } = req.body

    let hashedPassword = bcrypt.hashSync(password, saltRounds);

    User.create({
        firstName: firstName,
        username: username,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        location: location,
        favfaction: favfaction

    }).then((new_user) => {
        res.redirect("/")
    })
})
//create a new army
app.post('/armygen/', (req, res) => {
    const { title, faction, totalPoints } = req.body

    if (!title && !totalPoints) {
        return res.json({ err: "Enter your army name and point total" })
    }
    Army.create({
        title: title,
        faction: faction,
        totalPoints: totalPoints,
        userId: req.session.userId,
    }).then((new_army) => {
        res.json(new_army)
    })
})
//Get all Armys
app.get('/army', (req, res) => {
    const { title, faction, totalPoints } = req.body

})
//delete army
app.delete('/deleteArmy/', (req, res) => {
    const { id } = req.body
    if (req.session.userId) {
        Army.destroy({ where: { id } }).then(
            (results) => {
                console.log(results);
                res.json({});
            }
        );
    } else {
        res.json({ success: false, message: 'Army deletion failed' });
    }
});
app.put('/army', (req, res) => {
    const { title, faction, totalPoints } = req.body
})
//create new unit
app.post('/unit/', (req, res) => {
    const { unitName, unitType, unitTier, unitPoint, armyId } = req.body

    if (!unitName && !unitPoint) {
        return res.json({ err: "Enter your units name and unit point amount" })
    }
    Unit.create({
        unitName: unitName,
        unitType: unitType,
        unitTier: unitTier,
        unitPoint: unitPoint,
        armyId: armyId
    }).then((new_unit) => {
        res.json(new_unit)
    })
})
//updates unit information
app.put('/unit', (req, res) => {
    const { unitName, unitType, unitTier, unitPoint } = req.body
})


//User login
app.post('/', async (req, res) => {
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
            req.session.userId = user.id
            req.session.username = user.username
            res.json({ success: true, redirect: '/homepage' });
        } else {
            res.json({ success: false })
        }
    })
})
// Armies and Unit Manager
app.get('/homepage/', async (req, res) => {
    console.log('User ID from session:', req.session.userId)
    const userId = req.session.userId;
    const users = await User.findByPk(userId, {
        include: Army
    }).then(function (user) {
        console.log(JSON.stringify(user, null, 2))
        res.render('userTemplate', {
            locals: {
                title: user.firstName,
                username: user.firstName,
                armies: user.Armies
            },
            partials: {
                body: 'partials/userSpread'
            }
        })
    })
});



app.get('/get-session', (req, res) => {
    const userId = req.session.userId;
    const username = req.session.username;
    console.log(userId)
    res.json({ userId, username });
});

app.get('/destroy', (req, res) => {
    req.session.destroy(function (err) {
    })
    res.json("session deleted")
})

app.listen(3000, () => {
    console.log("server listening on port 3000")
})


