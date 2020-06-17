/** @format */

const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const logger = require("morgan")
const keys = require("./config/keys")
const passport = require("passport")

const cookieParser = require("cookie-parser")
const models = require("./models/index")
const cookieSession = require("cookie-session")
const stripe = require("stripe")(keys.stripeSecret)
const mongoose = require("mongoose")
const cors = require("cors")

const compression = require("compression")
const redirectToHTTPS = require("express-http-to-https").redirectToHTTPS

const fetch = require("node-fetch")
const Sentry = require("@sentry/node")
fetch.Promise = require("bluebird")

const app = express()

require("./services/passport")

if (process.env.NODE_ENV) {
    //if prod force use of key switcher, we should probably move this elsewhere
    //Dev/Prod backend connections
    Sentry.init({dsn: keys.sentryServer})

    // Sentry.configureScope((scope) => {
    //   scope.setUser({"email": req.user.email});
    // })

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler())
}

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(
    redirectToHTTPS(
        [/localhost:(\d{4})/, /127.0.0.1:(\d{4})/],
        [/\/insecure/],
        301
    )
)
app.use(compression())
app.use(logger("dev"))
app.use(cookieParser())
app.use(cors({exposedHeaders: ["Content-Range", "Content-Length"]}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey],
    })
)
app.use(passport.initialize())
app.use(passport.session())

// Set routes
require("./routes/authRoutes")(app, models)
require("./routes/loggingRoutes")(app)
require("./routes/mealRoutes")(app, models)
require("./routes/nutritionPlanRoutes")(app, models)
require("./routes/topScoreRoutes")(app, models)
require("./routes/userRoutes")(app, models)
require("./routes/workoutRoutes")(app, models)

if (process.env.NODE_ENV === "production") {
    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler())

    app.use(express.static(path.join(__dirname, "client/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
    })
}

app.listen(process.env.PORT || 8080)
