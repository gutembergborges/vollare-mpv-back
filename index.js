const config = require('./config')
const restify = require('restify')
const mongoose = require('mongoose')


const server = restify.createServer({
    name: config.name,
    version: config.version
})

// We need a plugin to do Parse of Request body
server.use(restify.plugins.bodyParser())

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