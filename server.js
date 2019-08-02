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
const models = require('./models/index')
const cookieSession = require('cookie-session')
const requireLogin = require('./middlewares/requireLogin')
const fs = require('fs')
const pdf = require('html-pdf')
const sgMail = require('@sendgrid/mail')
const stripe = require('stripe')(keys.stripeSecret)
const mongoose = require('mongoose')
const cors = require('cors');
const jwt = require('jwt-simple')
const emailTemplate = require('./services/emailTemplate')
const freePlanTemplate = require('./services/freePlanTemplate')
const trainingTemplate = require('./services/trainingTemplate')
const welcomeTemplate = require('./services/welcomeTemplate')
const compression = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const app = express()
const fetch = require('node-fetch')
const Sentry = require('@sentry/node')
fetch.Promise = require('bluebird')
// const planTest = process.env.NODE_ENV ? null : require('./planTest')

//TODO: Clean and SPLIT this file up!


if (process.env.NODE_ENV) {//if prod force use of key switcher, we should probably move this elsewhere
  //Dev/Prod backend connections
  mongoose.connect(keys.mongoURI, { useMongoClient: true })
  Sentry.init({ dsn: keys.sentryServer })

  // Sentry.configureScope((scope) => {
  //   scope.setUser({"email": req.user.email});
  // })

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler())
  
} else {
  //Local testing
  // mongoose.connect('mongodb://localhost:27017')
  
  //Dev/Prod backend connections
  mongoose.connect(keys.mongoURI, { useMongoClient: true })
}

sgMail.setApiKey(keys.sendGridKey)

//TODO: Replace const in code with model calls
const User = models.User
const Plans = models.Plans
const Exercises = models.Exercises
const UserProfile = models.UserProfile
const Workout = models.Workouts 

const localLogin = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
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
      // console.log(profile)
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

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/, /127.0.0.1:(\d{4})/], [/\/insecure/], 301))
app.use(compression())
app.use(logger('dev'))
app.use(cookieParser())
app.use(cors({exposedHeaders:['Content-Range', 'Content-Length']}))
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

// fetch_workouts

app.get('/api/plans', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const userPlans = await Plan.find({ _user: req.user.id })
  res.send(userPlans)
})

app.get('/api/meals', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const userMeals = await models.Meals.find({ creator: req.user.id }).select('-creator')
  res.send(userMeals)
})

app.get('/api/plan_templates', async (req, res, next) => {
  requireLogin(req, res, next)

  const allPlans = await models.PlanTemplates.find()
  res.send( allPlans)
})

//TODO: Refactor for less queries
app.get('/api/active_training_plan', async (req, res, next) => {
  requireLogin(req, res, next)
  let prof = await UserProfile.findOne({ _user: req.user.id })
  try {
    let activePlan = await models.Plans.findOne({_id:prof.activePlan})
    // console.log(activePlan, 'ACTIVE')
    let template = await models.PlanTemplates.findOne({_id:activePlan.template})
    console.log(template, 'TEMPLATE FOUND?')
    res.send({...activePlan._doc, name:template.name, description:template.description })
    // res.send({...activePlan._doc, days:activePlan.days })
  } catch (error) {
    res.send(null)
  } 
  

  
})

app.get('/api/nutrition_plans', async (req, res, next) => {
  requireLogin(req, res, next)

  const allPlans = await models.NutritionPlan.find({creator:req.user.id}).select('-creator')
  res.send(allPlans)
})

app.get('/api/exercises', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const exerciseList = await Exercises.find().select('-_id')
  res.send(exerciseList)
})

app.param('prof_id', async (req, res, next, id) => {
  const userProf = await UserProfile.findOne({ _id: id })
  req.plan = userProf

  next()
})

//// BEGIN APIS FOR ADMIN PANEL ////////
const objMapper = (obj) => {
  let ret  = []
  obj.map((p,i)=>{
    let prof = {
      id:p._id,
      ...p._doc
    }
    ret.push(prof)
  })
  return ret
}

app.delete('/api/users', async (req, res, next) => {
  requireLogin(req, res, next)
  let item = req.body.id
  await models.NutritionPlan.deleteOne({_id:item})
  res.status(200).send('Success')
})

app.get('/api/users', async (req, res, next) => {
  requireLogin(req, res, next)
  const users = await User.find().select('-password -v')

  res.set('Content-Range', 'users' +' '+users.length)
  res.set('Access-Control-Expose-Headers', 'Content-Range')
  res.send(objMapper(users))
})

app.get('/api/profiles', async (req, res, next) => {
  requireLogin(req, res, next)
  const profiles = await UserProfile.find()
  res.set('Content-Range', 'profiles' +' '+profiles.length)
  res.set('Access-Control-Expose-Headers', 'Content-Range')
  res.send(objMapper(profiles))
})

app.get('/api/all_plans', async (req, res, next) => {
  requireLogin(req, res, next)
  const plans = await Plan.find()

  res.set('Content-Range', 'plans' +' '+plans.length)
  res.set('Access-Control-Expose-Headers', 'Content-Range')
  res.send(objMapper(plans))
})


app.get('/api/all_workouts', async (req, res, next) => {
  requireLogin(req, res, next)
  const workouts = await Workout.find()

  res.set('Content-Range', 'workouts' +' '+workouts.length)
  res.set('Access-Control-Expose-Headers', 'Content-Range')
  res.send(objMapper(workouts))
})


app.get('/api/admin_exercises', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const exerciseList = await Exercises.find()
  res.set('Content-Range', 'exercises' +' '+exerciseList.length)
  res.set('Access-Control-Expose-Headers', 'Content-Range')
  res.send(objMapper(exerciseList))
})

app.get('/api/profiles/:prof_id', async (req, res) => {
  // console.log('Request Id:', req.params.id);
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  res.send(req.params.prof_id)
})

//// END ////////

app.get('/api/fetch_workouts', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  const workoutList = await Workout.find()
  res.send(workoutList)
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
    req.user.password = ''
    res.send({ user: req.user })
  } else {
    res.send({ user: null })
  }
})

// app.post('/api/logged_user_local', async (req, res) => {
//   // console.log(req.body.token)
//   let decoded = jwt.decode(req.body.token, keys.secret)
//   // console.log(process.env.NODE_ENV, 'ENV')
//   User.findById(decoded.sub, (err, user) => {
//     if (err) {
//       return err
//     }

//     if (user) {
//       user.password = ''
//       return res.send({ user: user })
//     } else {
//       return res.send({ user: null })
//     }
//   })
// })

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

app.get('/api/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!')
})

app.get('/api/beta_users', async (req, res, next) => {
  // requireLogin(req, res, next)
  let betas = await models.BetaUsers.find()
  let emailList = betas.map(beta=>beta.Email)
  // console.log(emailList)
  // req.session = null;
  res.send(betas)
})

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/')
})



app.get('/api/user_workout_data', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  UserProfile.findOne({ _user: req.user.id }, (err, profile) => {
    if (err) {
      return err
    }

    console.log(req.body)

    // If the user has a profile set the plan accordingly.
    if (profile) {
      models.Plans.findOne({_id:profile.activePlan}, async (err, plan) =>{
        if (err) {
          return err
        }

        if(plan) {
          res.status(200).send(plan.stats)
        }
      })
      
    } else {
      return res.send(500, { error: 'no profile found' })
    }
  })

})

//START POSTS

//Authenticate User locally then supply jwt
app.post('/api/signin', passport.authenticate('local', { session: true }), async (req, res, next) => {
  // console.log('inside logg')
  //Remove password before sending user
  req.user.password = ''
  res.send({ token: tokenForUser(req.user), user: req.user })
})

// Slack Feedback
app.post('/api/send_feedback', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  if (!process.env.NODE_ENV) {
    return res.status(401).send({ error: 'Feedback only for production' });
  }

	// Change this later if you plan on changing the payload from the frontend
	if (!keys.slackWebHook || !req.body['attachments'] || req.body['attachments'].length == 0) return res.status(500)

	let {author_name, color, fallback, footer, text, title, title_link} = req.body['attachments'][0] // Not using, but may be useful in future.
	await fetch(keys.slackWebHook, {
		method: 'POST',
		body: JSON.stringify(req.body)
	}).then(() => {
		return res.status(200).send('The feedback was successfully sent!')
	}).catch( () => {
		return res.status(500)
	})
})

app.post('/api/new_plan_template', async (req, res) => {
  if (!req.user  ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  
  let { plan, workouts, data } = req.body
  // console.log(workouts)
  let plan_template = new models.PlanTemplates({
    name: plan.title,
    category: plan.category,
    created_date: Date.now(),
    creator: req.user.id,
    workouts: workouts,
    workoutData: data
  })
  plan.logo ? plan_template.logo = plan.logo : null
  plan.description ? plan_template.description = plan.description : null

  await plan_template.save()

  res.status(200).send('Success')
})


app.post('/api/delete_meal', async (req, res) => {
  if (!req.user  ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { id } = req.body
  await models.Meals.deleteOne({_id:id})

  res.status(200).send('Success')
})


app.post('/api/delete_nutrition_plan', async (req, res) => {
  if (!req.user  ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { id } = req.body
  await models.NutritionPlan.deleteOne({_id:id})

  res.status(200).send('Success')
})

app.post('/api/new_user_plan', async (req, res) => {
  if (!req.user  ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { template, start_date, end_date, days } = req.body
  let user_plan = new models.Plans({
    end_date,
    start_date,
    template,
    days,
  })
  await user_plan.save()

  // Now store the plan into the user profile to keep trac of it.
  UserProfile.findOne({ _user: req.user.id }, (err, profile) => {
    if (err) {
      return err
    }

    // If the user has a profile set the plan accordingly.
    if (profile) {
      profile.activePlan = user_plan._id
      let arr = [...profile.trainingPlans]
      arr.push(user_plan._id)
      profile.trainingPlans = arr
      profile.save()
    } else {
      return res.send(500, { error: 'no profile found' })
    }
  })


  res.status(200).send('Success')
})


app.post('/api/nutrition_plan', async (req, res) => {
  if (!req.user ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { items, day, name } = req.body
  let itemIds = items.map((item)=> item.meal._id)
  // console.log(itemIds)
  let nutrition_plan = new models.NutritionPlan({
    scheduleData: items,
    creator: req.user.id,
    items: itemIds
  })
  day ? nutrition_plan.day = day : null
  name ? nutrition_plan.name = name : null
  await nutrition_plan.save()

  res.status(200).send('Success')
})


app.post('/api/new_meal', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { items, calories } = req.body
  let meal = new models.Meals({
    items: items,
    // time: time,
    calories: calories,
    creator: req.user.id
  })
  await meal.save()
  res.status(200).send('Success')
})

app.post('/api/workout_tracker', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  UserProfile.findOne({ _user: req.user.id }, (err, profile) => {
    if (err) {
      return err
    }

    console.log(req.body, 'WORKOUT DATA')

    // If the user has a profile set the plan accordingly.
    if (profile) {
      models.Plans.findOne({_id:profile.activePlan}, async (err, plan) =>{
        if (err) {
          return err
        }

        if(plan) {
          let arr = [plan.stats]
          arr.push(req.body)
          plan.stats = arr
          await plan.save()
          res.status(200).send('Success')
        }
      })
      
    } else {
      return res.send(500, { error: 'no profile found' })
    }
  })

})

app.post('/api/log_meal', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { id, log  } = req.body
  await models.NutritionPlan.findOne({_id:id}, (err, plan) => {
    // console.log(meal.completions, meal)
    if (err) {
      return err
    }

    if (plan) {
      let arr = [...plan.log]
      arr.push(log)
      plan.log = arr
      plan.save()
      // console.log(plan.log)
      res.status(200).send('Success')
    }

  })

})

app.post('/api/new_workout', async (req, res) => {
  if (!req.user ) {
    // console.log(req.user)
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { workout } = req.body
  // console.log(workout)
  let newWorkout = new Workout({
    type: workout.type,
    title: workout.title,
    exercises: workout.list,
  })
  await newWorkout.save()
  res.status(200).send('Success')
})


app.post('/api/init_training_plan', async (req, res) => {
  if (!req.user ) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  let { workout } = req.body
  // console.log(workout)
  let newWorkout = new Plans({
    type: workout.type,
    title: workout.title,
    exercises: workout.list,
  })
  await newWorkout.save()
  res.status(200).send('Success')
})

app.post('/api/update_profile', async (req, res, next) => {
  requireLogin(req, res, next)
  let keys = req.body.keys
  // console.log(keys ,req.body[keys[0]])
  await UserProfile.findOne({ _user: req.user.id }, (err, prof) => {
    if (err) return res.send(500, { error: err })
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === 'nutritionSchedule' || keys[i] === 'weighIns') {
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

//DEPRECATED
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

const expectedKeys = ['email', 'name', 'password1', 'gender', 'height_ft', 'height_in', 'current_weight', 'age', 'somatype', 'activity_mod' ]
app.post('/api/signup', async (req, res, next) => {

  try {
    expectedKeys.map(key=>{
      // console.log(key)
      if (!req.body[key] || req.body[key === '']) {
        throw new Error('Error:' +[key]+ ' required' )
      } 
    })
  } catch (error) {
    return res.status(500).send(error)
  }
  


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
    let accessDenied = await models.BetaUsers.find({Email:email}, (err, beta)=>{
        console.log(beta)
        if (beta.length === 0) {
          return true 
        }
        else {
          return false
        }
      })

    
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
      return res.status(422).send({ message:'An account with this email address has already been created.' })
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
      startDate: new Date()
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
      subject: 'A New User Has Signed Up!',
      text: name,
      html: emailTemplate(req),
    }

    user.save(async (err) => {
      if (err) {
        return next(err)
      }

      try {
        var profile = new UserProfile({
          email: email,
          _user: user.id,
          macros: somatype.macro,
          calories: userBMR * modifier,
          baseSomaType: somatype,
        })
      } catch (error) {
        return res.status(422).send({ message: error })
      }
      
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
  // const user = await req.user.save()
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
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())
  
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })
}

app.listen(process.env.PORT || 8080)
