/** @format */
const sgMail = require("@sendgrid/mail")

const requireLogin = require("../middlewares/requireLogin")
const emailTemplate = require("../services/emailTemplate")
const freePlanTemplate = require("../services/freePlanTemplate")
const trainingTemplate = require("../services/trainingTemplate")
const welcomeTemplate = require("../services/welcomeTemplate")
const keys = require("../config/keys")

sgMail.setApiKey(keys.sendGridKey)

const msg = (req, email) => ({
    to: email,
    from: "no-reply@trufit.co",
    subject: "Welcome to TruFit!",
    text: "Welcome",
    html: welcomeTemplate(req),
})

const alert = (req, name) => ({
    to: "lscott@trufit.com",
    from: "no-reply@trufit.co",
    subject: "A New User Has Signed Up!",
    text: name,
    html: emailTemplate(req),
})

const requiredKeys = [
    "email",
    "name",
    "confirm_password",
    "hours_active",
    "prior_exp",
    "current_weight",
    "tbw",
    "goal",
    "neat",
]

module.exports = (app, models) => {
    app.post("/api/signup", async (req, res, next) => {
        try {
            requiredKeys.map((key) => {
                if (!(key in req.body) || req.body[key] === " ") {
                    throw new Error("Error: " + [key] + " required")
                }
            })
        } catch (error) {
            return res.status(500).send(error)
        }

        // Account and profile constants
        const email = req.body.email
        const name = req.body.name
        const password = req.body.confirm_password
        const gender = "gender" in req.body ? req.body.gender : null
        const goal = req.body.goal
        const hoursActive = parseInt(req.body.hours_active)
        const currentWeight = parseInt(req.body.current_weight)
        const tbw = parseInt(req.body.tbw)
        const neat = req.body.neat
        const priorExp = parseInt(req.body.prior_exp)
        const calorieGoal = (neat + hoursActive) * tbw

        // const findBMR = () => {
        //     let inToCm = height * 2.54 //190.54
        //     let lbsToKg = currentWeight / 2.2 //104.54
        //     if (gender === "male") {
        //         let BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * age + 5
        //         return Math.round(BMR)
        //     } else if (gender === "female") {
        //         let BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * age - 161
        //         return Math.round(BMR)
        //     }
        // }

        //Check if user exists via email
        await models.User.findOne({email: email}, async (err, existingUser) => {
            if (err) {
                return next(err)
            }

            if (existingUser) {
                return res.status(422).send({
                    message:
                        "An account with this email address has already been created.",
                })
            }

            //Create new user model
            models.User.create(
                {
                    email,
                    password,
                    currentWeight,
                    name,
                    startDate: new Date(),
                    gender,
                },
                (err, user) => {
                    if (err) return next(err)

                    // Create user profile
                    models.UserProfile.create(
                        {
                            _user: user.id,
                            currentWeight,
                            goal,
                            hoursActive,
                            tbw,
                            neat,
                            priorExp,
                            calorieGoal,
                        },
                        (err, profile) => {
                            if (err) return next(err)
                            console.log(profile, "PROF?")
                        }
                    )
                }
            )

            await sgMail.send(msg(req, email))
            await sgMail.send(alert(req, name))
            return res.status(200).send("Success")
        })
    })

    //TODO: Might be deprecated check api
    app.post("/api/evaluate_profile", async (req, res, next) => {
        //TODO: make this a custom middle ware
        const profileKeys = [
            "hours_active",
            "prior_exp",
            "current_weight",
            "tbw",
            "goal",
            "neat",
        ]

        try {
            profileKeys.map((key) => {
                if (!(key in req.body) || req.body[key] === " ") {
                    throw new Error("Error: " + [key] + " required")
                }
            })
        } catch (error) {
            return res.status(500).send(error)
        }

        const goal = req.body.goal
        const hoursActive = parseInt(req.body.hours_active)
        const currentWeight = parseInt(req.body.current_weight)
        const tbw = parseInt(req.body.tbw)
        const neat = req.body.neat
        const priorExp = parseInt(req.body.prior_exp)
        const calorieGoal = (neat + hoursActive) * tbw

        const profile = new models.UserProfile(
            {
                _user: req.user.id,
                currentWeight,
                goal,
                hoursActive,
                tbw,
                neat,
                priorExp,
                calorieGoal,
            },
            (err, profile) => {
                if (err) return res.status(500).send(err)
            }
        )
        profile.save()
        return res.status(200).send(profile)
    })
    //TODO: Refactor these two calls, should only need one
    app.get("/api/logged_user", (req, res) => {
        if (req.user)
            models.UserProfile.findOne({_user: req.user.id}, (err, profile) => {
                if (err) {
                    // console.log(err)
                    return res.send({profile: null})
                }

                if (profile) {
                    req.user.password = ""
                    return res.send({profile, user: req.user})
                } else {
                    return res.send({profile: null})
                }
            })
        else return res.send({profile: null, user: null})
    })

    app.get("/api/user_profile", async (req, res, next) => {
        requireLogin(req, res, next)
        if (req.user)
            models.UserProfile.findOne({_user: req.user.id}, (err, profile) => {
                if (err) {
                    // console.log(err)
                    return res.send({profile: null})
                }

                if (profile) {
                    req.user.password = ""
                    return res.send({profile, user: req.user})
                } else {
                    return res.send({profile: null, user: null})
                }
            })
        else return res.send({profile: null, user: null})
    })

    app.get("/api/beta_users", async (req, res, next) => {
        // requireLogin(req, res, next)
        let betas = await models.BetaUsers.find()
        let emailList = betas.map((beta) => beta.Email)
        // console.log(emailList)
        // req.session = null;
        res.send(betas)
    })

    app.post("/api/update_profile", async (req, res, next) => {
        requireLogin(req, res, next)
        let keys = req.body.keys
        // console.log(keys ,req.body[keys[0]])
        await models.UserProfile.findOne({_user: req.user.id}, (err, prof) => {
            if (err) return res.send(500, {error: err})
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === "nutritionSchedule" || keys[i] === "weighIns") {
                    // console.log("fired??")
                    prof[keys[i]].push(req.body[keys[i]])
                } else {
                    prof[keys[i]] = req.body[keys[i]]
                }
            }
            prof.save()
            res.status(200).send(prof)
        })
    })
}
