if (process.env.NODE_ENV === 'production') {
  //production
  module.exports = require('./prod');
} else if (process.env.NODE_ENV != 'production') {
  //development
  module.exports = require('./dev.js');
}
