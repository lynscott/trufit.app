module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  stripeSecret: process.env.STRIPE_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  sendGridKey: process.env.SENDGRID,
  secret: process.env.SECRET,
  accessList: process.env.PRE_ACCESS_LIST,
  slackWebHook: process.env.SLACK_WEBHOOK,
  sentryServer: process.env.SENTRY_SERVER
};
