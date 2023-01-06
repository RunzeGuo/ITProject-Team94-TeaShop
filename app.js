// Import express
const express = require('express')

// Set your app up as an express app
const app = express()
//
const path = require('path')
const router = express.Router()
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const session = require('express-session')

app.engine('hbs', exphbs.engine({
    defaultLayout : '',
    extname : 'hbs'
}))
app.set('view engine', 'hbs')

//add models Mongo DB
require('./models')
// link to our router
const demoRouter = require('./routes/demoRouter')

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: true })) // only needed for URL-encoded input
app.use(flash()) // flash messages for failed logins

// the demo routes are added to the end of the '/demo-management' path
app.use('/', router)
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.

//for login page
/* For Login page*/
router.get('/login',function(req,res){
    res.sendFile(path.join(__dirname+'/views/demostock.html'))
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'cookies',
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production',
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}
    
const passport = require('./passport')
app.use(passport.authenticate('session'))

// Authentication middleware for different roles

// For customer
const customerAuthenticated = (req, res, next) => {
    // If customer is not authenticated via Passport, redirect to patient login page
    if (!req.isAuthenticated()) {
        return res.redirect('/customerLogin')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// For teamaker
const teaMakerAuthenticated = (req, res, next) => {
    // If teamaker is not authenticated via Passport, redirect to clinician login page
    if (!req.isAuthenticated()) {
        return res.redirect('/teamakerLogin')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Set up role-based authentication
const customerRole = (req, res, next) => {
    
    if (req.user.role != 'customer') { 
        return res.sendFile('/Users/dongjiaheng/ITProject-Team94/itdemo/views/wrongrole.html')
    }
        
    else {
        return next()
    }
} 

const teamakerRole = (req, res, next) => {
    if (req.user.role != 'teamaker') {
        return res.sendFile('/Users/dongjiaheng/ITProject-Team94/itdemo/views/wrongrole.html')
    }
    else {
        return next()
    }
}

const auth = require('./routes/auth')
app.use(auth)

const teamakerAuth = require('./routes/teamakerAuth')
app.use(teamakerAuth)

app.use(express.static('public'))

const customer_router = require('./routes/customerRouter')
app.use('/customer', customerAuthenticated, customerRole, customer_router)

const teamaker_router = require('./routes/restaurantRouter')

app.use('/teamaker', teaMakerAuthenticated, teamakerRole, teamaker_router)

app.use('/restaurant', teaMakerAuthenticated, teamakerRole, teamaker_router)


app.listen(process.env.PORT || 3000, () => {
    console.log('The app is running!')
});