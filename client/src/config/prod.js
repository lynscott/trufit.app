module.exports = {
  stripePubKey: process.env.STRIPE_PUB_KEY,
  preAccessList: [process.env.PRE_ACCESS_LIST.split(' ')]
}
