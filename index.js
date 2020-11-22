// Module dependencies
const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')

// Initialize server
const server = restify.createServer({
    name: config.name,
    version: config.version
})

// Middleware
// We need a plugin to do Parse of Request body
server.use(restify.plugins.bodyParser())
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

// Start server, connect to DB and require routes
// Select server port to listen
server.listen(config.port, () => {
    // establish connection to mongodb
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, { useUnifiedTopology: true, useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
    db.once('open', () => {
        require('./routes')(server);
        console.log('API listening on port 8080');
    });
})