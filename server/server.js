if (process.env.NODE_ENV === 'production') {
  module.exports = require('./server.prod.js')
} else {
  module.exports = require('./server.dev.js')
}
