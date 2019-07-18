module.exports = {
  stripePubKey: process.env.STRIPE_PUB_KEY,
  preAccessList: process.env.PRE_ACCESS_LIST ? [process.env.PRE_ACCESS_LIST.split(' ')] : [],
  slackWebHook: process.env.SLACK_WEBHOOK,
  sentry: process.env.SENTRY
}
