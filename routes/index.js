module.exports = function(server) {
    // users API endpoints
    require('./users')(server);
}