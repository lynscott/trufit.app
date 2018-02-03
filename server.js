const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const keys = require('./config/keys');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const cookieParser = require('cookie-parser');
require('./models/User');
const cookieSession = require('cookie-session');
const requireLogin = require('./middlewares/requireLogin');
const fs = require('fs');
const pdf = require('html-pdf');
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(keys.stripeSecret);
const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const emailTemplate = require('./services/emailTemplate');
const freePlanTemplate = require('./services/freePlanTemplate');
const trainingTemplate = require('./services/trainingTemplate');
const app = express();
mongoose.connect(keys.mongoURI);

sgMail.setApiKey(keys.sendGridKey);

const User = mongoose.model('users');
const Plan = mongoose.model('plans');

const localLogin = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }

        done(null, user);
      });
    });
  }
);

function tokenForUser(user) {
  timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

//Set up options for jwt Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //See if user id from payload exist in database
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id });
      if (existingUser) {
        //We have this user already
        done(null, existingUser);
      } else {
        //Dont have this user
        const user = await new User({
          googleID: profile.id,
          name: profile.displayName,
          gender: profile.gender,
          img: profile.photos[0].value,
          email: profile.emails[0].value,
          provider: profile.provider
        }).save();
        done(null, user);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields: [
        'id',
        'name',
        'displayName',
        'email',
        'gender',
        'picture'
      ],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const existingUser = await User.findOne({ facebookID: profile.id });
      if (existingUser) {
        done(null, existingUser);
      } else {
        const user = await new User({
          facebookID: profile.id,
          name: profile.displayName,
          gender: profile.gender,
          img: profile.photos[0].value,
          email: profile.emails[0].value,
          provider: profile.provider
        }).save();
        done(null, user);
      }
    }
  )
);

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/plans', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  const userPlans = await Plan.find({ _user: req.user.id });
  res.send(userPlans);
});

app.param('id', async (req, res, next, id) => {
  const userPlan = await Plan.findOne({ _id: id });
  req.plan = userPlan;

  next();
});

app.get('/api/plans/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  res.send(req.plan);
});

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  })
);

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect('/');
  }
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/api/logged_user', (req, res) => {
  res.send(req.user);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  }
);

app.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    res.send({ token: tokenForUser(req.user) });
  }
);

app.post('/signup', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  await User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res
        .status(422)
        .send({ error: 'This email address has already been used' });
    }

    const user = new User({
      email,
      password,
      gender,
      name
    });
    user.save(err => {
      if (err) {
        return next(err);
      }
      //Respond with user token
      res.json({ token: tokenForUser(user) });
    });
  });
});

app.post('/api/intake/shred', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  const { age, height, weight, body_fat, activity_mod } = req.body;
  var plan = new Plan({
    planName: 'Weight Loss',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now()
  });
  plan = await plan.save();
  req.user.plans.push(plan.id);
  const user = await req.user.save();
  res.status(200).send(plan);
});

app.post('/api/intake/tone', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  const { age, height, weight, body_fat, activity_mod } = req.body;
  var plan = new Plan({
    planName: 'Tone & Sculpt',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now()
  });
  plan = await plan.save();
  req.user.plans.push(plan.id);
  const user = await req.user.save();
  res.status(200).send(plan);
});

app.post('/api/intake/strength', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  const { age, height, weight, body_fat, activity_mod } = req.body;
  var plan = new Plan({
    planName: 'Savage Strength',
    height,
    weight,
    body_fat,
    age,
    activity_mod,
    _user: req.user.id,
    datePurchased: Date.now()
  });
  plan = await plan.save();
  req.user.plans.push(plan.id);
  const user = await req.user.save();
  res.status(200).send(plan);
});

app.post('/api/freeplans', async (req, res) => {
  // pdf.create(html).toFile('./tmp/trainingplan.pdf', (err, res) => {
  //   console.log(res.filename);
  // });
  const { name, type, person, email } = req.body;
  const msg = {
    to: req.body[0].email,
    from: 'no-reply@LsFitness.com',
    subject: 'Free Training Plan',
    text: req.body[1].name,
    html: freePlanTemplate(req)
  };
  await sgMail.send(msg);
  res.sendFile('./tmp/trainingplan.pdf');
});

// app.post('/api/pdf', async (req, res) => {
//   console.log(req.body);
//   pdf.create(`${req.body}`).toFile('./trainingplan.pdf', (err, res) => {
//     console.log(res);
//   });
//   res.send('200');
// });

app.post('/api/contactform', async (req, res) => {
  const { message, subject, email } = req.body;
  const msg = {
    to: 'lynscott@lsphysique.com',
    from: 'no-reply@LsFitness.com',
    subject: 'New Message!',
    text: 'New Message',
    html: emailTemplate(req)
  };
  await sgMail.send(msg);
  res.send('200');
});

app.post('/api/trainingform', async (req, res) => {
  const msg = {
    text: 'Form Below',
    from: 'no-reply@LSFitness.com',
    to: 'LS Fitness <lynscott@lsphysique.com>',
    subject: 'Training Form Submission',
    html: trainingTemplate(req)
  };
  await sgMail.send(msg);
  res.send('200');
});

app.post('/api/stripe', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  const charge = await stripe.charges.create({
    amount: 3900,
    currency: 'usd',
    description: 'Training Plan',
    source: req.body.id
  });
  // req.user.plans.push('Strength');
  const user = await req.user.save();

  res.status(200).send(user);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });
}

app.listen(process.env.PORT || 8080);
