/** @format */

const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const LocalStrategy = require("passport-local")
const keys = require("../config/keys")
const models = require("../models/index")
const User = models.User

//TODO: Wire this up
const refreshToken = (user) => {
    timestamp = new Date().getTime()
    return jwt.encode({sub: user.id, iat: timestamp}, keys.secret)
}

const localLogin = new LocalStrategy(
    {usernameField: "email"},
    (email, password, done) => {
        User.findOne({email: email}, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }

            user.comparePassword(password, user.password, (err, isMatch) => {
                if (err) {
                    return done(err)
                }
                if (!isMatch) {
                    return done(null, false)
                }

                return done(null, user)
            })
        })
    }
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

//Set up options for jwt Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: keys.secret,
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    //See if user id from payload exist in database
    User.findById(payload.sub, (err, user) => {
        if (err) {
            return done(err, false)
        }

        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

passport.use(localLogin)
passport.use(jwtLogin)

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({googleID: profile.id})
            if (existingUser) {
                //We have this user already
                done(null, existingUser)
            } else {
                //Dont have this user
                const user = await new User({
                    googleID: profile.id,
                    name: profile.displayName,
                    gender: profile.gender,
                    img: profile.photos[0].value,
                    email: profile.emails[0].value,
                    provider: profile.provider,
                }).save()
                done(null, user)
            }
        }
    )
)

passport.use(
    new FacebookStrategy(
        {
            clientID: keys.facebookClientID,
            clientSecret: keys.facebookClientSecret,
            callbackURL: "/auth/facebook/callback",
            profileFields: [
                "id",
                "name",
                "displayName",
                "email",
                "gender",
                "picture",
            ],
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log(profile)
            const existingUser = await User.findOne({facebookID: profile.id})
            if (existingUser) {
                done(null, existingUser)
            } else {
                const user = await new User({
                    facebookID: profile.id,
                    name: profile.displayName,
                    gender: profile.gender,
                    img: profile.photos[0].value,
                    email: profile.emails[0].value,
                    provider: profile.provider,
                }).save()
                done(null, user)
            }
        }
    )
)
