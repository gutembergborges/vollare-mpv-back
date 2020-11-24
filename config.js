module.exports = {
    name: 'vollare-mpv-back',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    base_url: process.env.BASE_URL || 'http://localhost:8080',
    db: {
        /*  using a mongodb cloud database: https://cloud.mongodb.com/v2/5fb9335ef712175c32e5b6ed#clusters
            mongodb+srv://<username></username>:<password>@cluster0.y1xkp.mongodb.net/<dbname>?retryWrites=true&w=majority
        */
        uri: process.env.MONGODB_URI || 'mongodb+srv://cloudmongo:cloudmongo@cluster0.y1xkp.mongodb.net/vollare-mpv-backend',
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}