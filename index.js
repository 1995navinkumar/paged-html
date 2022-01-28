if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/pagedHTML.production.min.js')
} else {
    module.exports = require('./dist/pagedHTML.development.js')
}