if (process.env.NODE_ENV) {
  //production
  console.log('prod env')
  module.exports = require('./prod');
} else {
  //development
  console.log('dev env')
  module.exports = require('./dev');
}
