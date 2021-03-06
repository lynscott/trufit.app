const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api/*', { 
    target: 'http://127.0.0.1:8080',
    secure:false,
    changeOrigin: true 
  }))
  app.use(proxy('/pay/*', { target: 'http://localhost:8080' }))
  app.use(proxy('/auth/facebook', { target: 'http://localhost:8080' }))
  app.use(proxy('/auth/google', { target: 'http://localhost:8080' }))
}
