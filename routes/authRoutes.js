/** @format */

const passport = require("passport")
const jwt = require("jwt-simple")
const keys = require("../config/keys")

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({sub: user.id, iat: timestamp}, keys.secret)
}

module.exports = (app, models) => {
    //Authenticate User locally then supply jwt
    app.post(
        "/api/signin",
        passport.authenticate("local", {session: true}),
        async (req, res, next) => {
            //Remove password before sending user

            req.user.password = ""
            const profile = await models.UserProfile.findOne({
                _user: req.user.id,
            })
            // console.log(profile)
            res.send({token: tokenForUser(req.user), user: req.user, profile})
        }
    )

    app.get(
        "/auth/facebook",
        passport.authenticate("facebook", {
            scope: ["public_profile", "email"],
        })
    )

    app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook"),
        (req, res) => {
            res.redirect("/")
        }
    )

    app.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: ["profile", "email"],
        })
    )

    app.get("/api/logout", (req, res) => {
        req.logout()
        // req.session = null;
        res.redirect("/")
    })

    app.get(
        "/auth/google/callback",
        passport.authenticate("google"),
        (req, res) => {
            res.redirect("/")
        }
    )
}
