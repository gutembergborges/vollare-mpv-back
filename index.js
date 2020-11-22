const restify = require('restify')
const mongoose = require('mongoose')

/* * criar um .env para guardar essas variáveis de ambiente e nao expô-las
    using a mongodb cloud database: https://cloud.mongodb.com/v2/5fb9335ef712175c32e5b6ed#clusters
    mongodb+srv://<username></username>:<password>@cluster0.y1xkp.mongodb.net/<dbname>?retryWrites=true&w=majority
*/

const server = restify.createServer({
    name: 'vollare-mpv-back',
    version: '0.0.1'
})

// We need a plugin to do Parse of Request body
server.use(restify.plugins.bodyParser())

// Select server port to listen
server.listen(8080, () => {
    // establish connection to mongodb
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb+srv://cloudmongo:cloudmongo@cluster0.y1xkp.mongodb.net/vollare-mpv-backend', { useUnifiedTopology: true, useNewUrlParser: true });
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