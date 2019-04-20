const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const logger = require('morgan')
const keys = require('./config/keys')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const cookieParser = require('cookie-parser')
require('./models/User')
require('./models/Plans')
require('./models/UserProfile')
const cookieSession = require('cookie-session')
const requireLogin = require('./middlewares/requireLogin')
const fs = require('fs')
const pdf = require('html-pdf')
const sgMail = require('@sendgrid/mail')
const stripe = require('stripe')(keys.stripeSecret)
const mongoose = require('mongoose')
const jwt = require('jwt-simple')
const emailTemplate = require('./services/emailTemplate')
const freePlanTemplate = require('./services/freePlanTemplate')
const trainingTemplate = require('./services/trainingTemplate')
const welcomeTemplate = require('./services/welcomeTemplate')
const app = express()
mongoose.Promise = require('bluebird')

mongoose.connect(keys.mongoURI, { useMongoClient: true })
mongoose.model('exercises', new mongoose.Schema())

sgMail.setApiKey(keys.sendGridKey)

const User = mongoose.model('users')
const Plan = mongoose.model('plans')
const Exercises = mongoose.model('exercises')
const UserProfile = mongoose.model('profile')

const localLogin = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false)
    }
    // console.log(user.password)

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
})

function tokenForUser(user) {
  timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret)
}

//TODO: Wire this up
let refreshToken = (user) => {
  timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret)
}

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
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
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
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id })
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
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'name', 'displayName', 'email', 'gender', 'picture'],
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      const existingUser = await User.findOne({ facebookID: profile.id })
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

app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
)
app.use(passport.initialize())
app.use(passport.session())

//START GETS

app.get('/api/plans', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const userPlans = await Plan.find({ _user: req.user.id })
  res.send(userPlans)
})

app.get('/api/plan_templates', async (req, res, next) => {
  requireLogin(req, res, next)

  const allPlans = await Plan.find().select('-_id')
  res.send(allPlans)
})

app.get('/api/exercises', async (req, res) => {
  const exerciseList = await Exercises.find().select('-_id')
  res.send(exerciseList)
})

app.param('id', async (req, res, next, id) => {
  const userPlan = await Plan.findOne({ _id: id })
  req.plan = userPlan

  next()
})

app.get('/api/plans/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  res.send(req.plan)
})

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  })
)

app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/')
})

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

app.get('/api/logged_user', (req, res) => {
  if (req.user) {
    res.send({ user: req.user })
  } else {
    res.send({ user: null })
  }
})

app.post('/api/logged_user_local', async (req, res) => {
  // console.log(req.body.token)
  let decoded = jwt.decode(req.body.token, keys.secret)
  // console.log(process.env.NODE_ENV, 'ENV')
  User.findById(decoded.sub, (err, user) => {
    if (err) {
      return err
    }

    if (user) {
      user.password = ''
      return res.send({ user: user })
    } else {
      return res.send({ user: null })
    }
  })
})

app.get('/api/user_profile', async (req, res, next) => {
  requireLogin(req, res, next)
  UserProfile.findOne({ _user: req.user.id }, (err, profile) => {
    if (err) {
      return err
    }

    if (profile) {
      // user.password = ''
      return res.send({ profile: profile })
    } else {
      return res.send({ profile: null })
    }
  })
})

app.get('/api/logout', (req, res) => {
  req.logout()
  // req.session = null;
  res.redirect('/')
})

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/')
})

//START POSTS

//Authenticate User locally then supply jwt
app.post('/api/signin', passport.authenticate('local', { session: true }), async (req, res, next) => {
  console.log('inside logg')
  //Remove password before sending user
  req.user.password = ''
  res.send({ token: tokenForUser(req.user), user: req.user })
})

app.post('/api/new_plan_template', async (req, res) => {
  // if (!req.user && ) {
  //   return res.status(401).send({ error: 'You must log in!' });
  // }
  let { plan, workouts } = req.body
  let plan_template = new Plan({
    planName: plan.title,
    category: plan.category,
    logo: plan.logo,
    template: plan,
    workouts: workouts,
  })
  plan_template = await plan_template.save()
  // req.user.plans.push(plan.id);
  // const user = await req.user.save();
  res.status(200).send('Success')
})

app.post('/api/update_profile', async (req, res, next) => {
  requireLogin(req, res, next)
  let keys = req.body.keys
  // console.log(keys ,req.body[keys[0]])
  await UserProfile.findOne({ _user: req.user.id }, (err, prof) => {
    if (err) return res.send(500, { error: err })
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === 'nutritionItems') {
        prof[keys[i]].push(req.body[keys[i]])
      } else {
        prof[keys[i]] = req.body[keys[i]]
      }
    }
    prof.save()
    res.status(200).send(prof)
  })
})

app.post('/api/update_food_item', async (req, res, next) => {
  requireLogin(req, res, next)

  // console.log(req.body.removeSchedule)
  await UserProfile.findOne({ _user: req.user.id }, async (err, prof) => {
    if (err) return res.send(500, { error: err })
    if (req.body.replace) {
      let index = req.body.index
      prof.nutritionItems.splice(index, 1, req.body.replace)
      prof.save()
      res.status(200).send(prof)
    } else if (req.body.schedule) {
      prof.nutritionSchedule.push(req.body.schedule)
      prof.save()
      res.status(200).send(prof)
    } else if (req.body.removeSchedule || req.body.removeSchedule === 0) {
      // console.log('removing', req.body.removeSchedule)
      let index = req.body.removeSchedule
      prof.nutritionSchedule.splice(index, 1)
      prof.save()
      res.status(200).send(prof)
    } else {
      let index = req.body.index
      prof.nutritionItems.splice(index, 1)
      prof.save()
      res.status(200).send(prof)
    }
  })
})

app.post('/api/signup', async (req, res, next) => {
  let email = req.body.email
  let name = req.body.name
  let password = req.body.password1
  let gender = req.body.gender
  let height = parseInt(req.body.height_ft) * 12 + parseInt(req.body.height_in) //75
  let currentWeight = parseInt(req.body.current_weight)
  let age = parseInt(req.body.age)
  let somatype = req.body.somatype
  let modifier = parseInt(req.body.activity_mod)

  //TEMP Access list check
  // console.log(process.env)
  if (process.env.NODE_ENV) {
    let preList = ['lennord@gmail.com', 'lunsford.carson@gmail.com', 'khalid3ali@gmail.com', 'ronaldwill94@gmail.com', 'nathanielneal21@gmail.com', 'buckhalterkyrie@gmail.com']
    if (!preList.includes(email)) {
      return res.status(401).send({ error: 'Sorry Reg is is only open for Beta testing! Come back soon!' })
    }
  }

  const findBMR = () => {
    let inToCm = height * 2.54 //190.54
    let lbsToKg = currentWeight / 2.2 //104.54
    if (gender === 'male') {
      let BMR = (9.99 * lbsToKg) + (6.25 * inToCm) - (4.92 * age )+ 5
      return Math.round(BMR)
    } else if (gender === 'female') {
      let BMR = (9.99 * lbsToKg ) + (6.25 * inToCm) - (4.92 * age) - 161
      return Math.round(BMR)
    }
  }

  

  await User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }

    if (existingUser) {
      return res.status(422).send({ error: 'This email address has already been used' })
    }


    // Instantiate user's BMR
    const userBMR = findBMR()

   
    const user = new User({
      email,
      password,
      gender,
      height,
      currentWeight,
      name,
    })

    let msg = {
      to: email,
      from: 'no-reply@LSFitness.com',
      subject: 'Welcome to LS Fitness!',
      text: 'Welcome',
      html: welcomeTemplate(req),
    }

    let alert = {
      to: 'lynscott@lsphysique.com',
      from: 'no-reply@LSFitness.com',
      subject: 'New User Sign Up',
      text: 'New User',
      html: emailTemplate(req),
    }

    user.save(async (err) => {
      if (err) {
        return next(err)
      }
      let profile = new UserProfile({
        email: email,
        _user: user.id,
        macros: somatype.macro,
        calories: userBMR * modifier,
        baseSomaType: somatype,
      })
      await profile.save()
      //Respond with user token
      await sgMail.send(msg)
      await sgMail.send(alert)
      res.json({ token: tokenForUser(user) })
    })
  })
})

app.post('/api/intake/shred', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const { age, height, weight, body_fat, activity_mod } = req.body
  let plan = new Plan({
    planName: 'Weight Loss',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now(),
  })
  plan = await plan.save()
  req.user.plans.push(plan.id)
  const user = await req.user.save()
  res.status(200).send(plan)
})

app.post('/api/intake/tone', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const { age, height, weight, body_fat, activity_mod } = req.body
  let plan = new Plan({
    planName: 'Tone & Sculpt',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now(),
  })
  plan = await plan.save()
  req.user.plans.push(plan.id)
  const user = await req.user.save()
  res.status(200).send(plan)
})

app.post('/api/intake/strength', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const { age, height, weight, body_fat, activity_mod } = req.body
  let plan = new Plan({
    planName: 'Savage Strength',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now(),
  })
  plan = await plan.save()
  req.user.plans.push(plan.id)
  const user = await req.user.save()
  res.status(200).send(plan)
})

app.post('/api/freeplans', async (req, res) => {
  // pdf.create(html).toFile('./tmp/trainingplan.pdf', (err, res) => {
  //   console.log(res.filename);
  // });
  const { name, type, person, email } = req.body
  const msg = {
    to: req.body[0].email,
    from: 'no-reply@LSFitness.com',
    subject: 'Free Training Plan',
    text: req.body[1].name,
    html: freePlanTemplate(req),
  }
  await sgMail.send(msg)
  res.sendFile('./tmp/trainingplan.pdf')
})

app.post('/api/contactform', async (req, res) => {
  const { message, subject, email } = req.body
  const msg = {
    to: 'lynscott@lsphysique.com',
    from: 'no-reply@LSFitness.com',
    subject: 'New Message!',
    text: 'New Message',
    html: emailTemplate(req),
  }
  await sgMail.send(msg)
  res.send('200')
})

app.post('/api/trainingform', async (req, res) => {
  const msg = {
    text: 'Form Below',
    from: 'no-reply@LSFitness.com',
    to: 'LS Fitness <lynscott@lsphysique.com>',
    subject: 'Training Form Submission',
    html: trainingTemplate(req),
  }
  await sgMail.send(msg)
  res.send('200')
})

app.post('/api/stripe', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const charge = await stripe.charges.create({
    amount: 3900,
    currency: 'usd',
    description: 'Training Plan',
    source: req.body.id,
  })
  // req.user.plans.push('Strength');
  const user = await req.user.save()

  res.status(200).send(user)
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })
}

app.listen(process.env.PORT || 8080)
