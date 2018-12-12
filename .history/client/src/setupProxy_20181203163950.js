const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api/*', { target: 'http://localhost:8080' }))
  app.use(proxy('/pay/*', { target: 'http://localhost:8080' }))
  app.use(proxy('/auth/facebook', { target: 'http://localhost:8080' }))
  app.use(proxy('/auth/google', { target: 'http://localhost:8080' }))
}

// "proxy": {
//     "/auth/google": {
//       "target": "http://localhost:8080"
//     },
//     "/auth/facebook": {
//       "target": "http://localhost:8080"
//     },
//     "/pay/*": {
//       "target": "http://localhost:8080"
//     },
//     "/api/*": {
//       "target": "http://localhost:8080"
//     }