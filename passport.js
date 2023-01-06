const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
//const User = require('./models/user')
const Database = require('./models/database_schema')

passport.serializeUser((user, done) => {
    done(undefined, user._id)
})

passport.deserializeUser((userId, done) => {
    Database.user.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

passport.use(
    new LocalStrategy(
    (username, password, done) => {
        Database.user.findOne({ username }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect email or password',
                })
            }
            
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect email or password',
                    })
                }

                return done(undefined, user)
            })
        })
    })
)

module.exports = passport