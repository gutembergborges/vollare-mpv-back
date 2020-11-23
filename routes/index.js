module.exports = function(server) {
    /* colocar os server.use e as configurações de server aqui*/
    // users API endpoints
    require('./users')(server);
}