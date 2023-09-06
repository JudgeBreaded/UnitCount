const express = require('express')
const app = express()
const { Op } = require("sequelize")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const sessionStore = require('express-session-sequelize')(session.Store)
const bcrypt = require('bcrypt')
const es6Renderer = require('express-es6-template-engine');
const { User, Army, Unit, sequelize } = require('./models')
const army = require('./models/army')
const saltRounds = 10



const sequelizeSessionStore = new sessionStore({
    db: sequelize
});

app.engine('html', es6Renderer);
app.set('views', './views');
app.set('view engine', 'html')

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

app.get('/', async (req,res)=> res.render('template', {
    locals: {
        title:"Welcome!"
    },
    partials: {
        body: 'partials/userLogin'
    }
})
)
//homepage
app.get('/homepage/:id', async (req, res) => {
    const users = await User.findByPk(req.params.id, { include: Army
        // where: {id : id}, include: [{
        //     model: Army}]

    }).then(function(user){
    console.log(JSON.stringify(user,null, 2))
    res.render('template', {
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
    // res.json(users);
});

app.get("/register", (req, res) => {
    res.render('template', {
        locals: {
            title:"Registration"
        },
        partials: {
            body: 'partials/userRegister'
        }
    })
})
// Creates new user 
app.post("/register", (req, res) => {
    const { firstName, lastName, username, email, password, location, favfaction } = req.body

    if (!email || !password || !username) {
        return res.json({ err: "please provide the required fields" });
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
        res.redirect("/login")
    })
})
//create a new army
app.post('/armygen/', (req, res) => {
    const {title, faction, totalPoints, userId} = req.body

    if (!title && !totalPoints){
        return res.json({err: "Enter your army name and point total"})
    }
    Army.create({
        title: title,
        faction: faction, 
        totalPoints: totalPoints,
        userId : userId,
    }).then((new_army) => {
        res.json(new_army)
    })
})
//Get all Armys
app.get('/army', (req, res) => {
    const {title, faction, totalPoints} = req.body

})

app.put('/army', (req, res) => {

})
//create new unit
app.post('/unit/', (req, res) => {
    const {unitName, unitType, unitTier, unitPoint, armyId} = req.body

    if (!unitName && !unitPoint){
        return res.json({err: "Enter your units name and unit point amount"})
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
    const {unitName, unitType, unitTier, unitPoint} = req.body
})


//User login
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
            req.session.userId = user.id
            req.session.username = user.username
            res.json({success: true })
        } else {
            res.json({ success: false })
        }
    })
})
//update user email
app.put('/users', async (req, res) => {
    if (!req.session.userId){
        res.redirect("/login", "redirecting to login screen")
    }
    const id = req.session.userId;
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