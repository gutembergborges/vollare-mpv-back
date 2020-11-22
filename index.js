const restify = require('restify')
const mongoose = require('mongoose')

/* * criar um .env para guardar essas variáveis de ambiente e nao expô-las
    using a mongodb cloud database: https://cloud.mongodb.com/v2/5fb9335ef712175c32e5b6ed#clusters
    mongodb+srv://<username></username>:<password>@cluster0.y1xkp.mongodb.net/<dbname>?retryWrites=true&w=majority
*/
mongoose.connect('mongodb+srv://cloudmongo:cloudmongo@cluster0.y1xkp.mongodb.net/vollare-mpv-backend', { useUnifiedTopology: true, useNewUrlParser: true })
        .then(_ => {

            const server = restify.createServer({
                name: 'vollare-mpv-back',
                version: '0.0.1'
            })

            // We need a plugin to do Parse of Request body
            server.use(restify.plugins.bodyParser())
            
            // Schema to database
            const userSchema = new mongoose.Schema({
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                role: {
                    type: String,
                    required: true
                }
            })

            // Model
            const User = mongoose.model('User', userSchema)
            
            // API endpoints
            // GET index - all users
            server.get('/users', (req, resp, next) => {
                User.find()
                .then(users => {
                    resp.json(users)
                    return next()
                })
            })
            
            // GET create - one user by id
            server.get('/users/:id', (req, resp, next) => {
                User.findById(req.params.id)
                .then(user => {
                    if(user){
                        resp.json(user)
                    } else {
                        resp.status(404)    // Not Found
                        resp.json({ message: 'not found' })
                    }
                    next()
                })
            })

            // POST store
            server.post('/users', (req, resp, next) => {
                let user = new User(req.body)   // receiving parameters from request body
                
                user.save()
                .then(user => {
                    resp.json(user)
                // * fazer uma checagem mais minuciosa no objeto de erro para imprimir o erro especifico e fazer um tratamento de erro mais rebuscado
                }).catch(error => {
                    resp.status(400)    // Bad Request => Incomplete/Wrong Request (faltam dados ou enviado dados errados na requisição)
                    resp.json({ message: error.message })
                })
            })

            // PUT/PATCH update
            server.put('/users/:id', (req, resp, next) => {  
                /*
                User.findById(req.params.id)
                .then(user=>{
                    if(user){
                        User.updateOne(user, req.body, function(error) {
                            if (error) {
                                resp.status(400)    // Bad Request => Incomplete/Wrong Request
                                resp.json({message: error.message})
                            }
                            resp.send(200, req.body);
                        });
                    } else {
                        resp.status(404)
                        resp.json({message: 'not found'})
                    }
                    return next()
                })
                */

                /* PUT compressed but errors less detailed
                */
                let opts = { returnOriginal: false }

                User.findOneAndUpdate({ _id: req.params.id }, req.body, opts)
                    .then(user => resp.send(204))
                    .catch(error => resp.send(500, error))

                next()
            })

            // DELETE destroy
            server.del('/users/:id', (req, resp, next) => {
                /*
                User.findOneAndDelete(req.params.id, function(err) {
                    if (err) {
                        console.error(err);
                        return next(
                            new errors.InvalidContentError(err.errors.name.message),
                        );
                    }
                    resp.send(204);
                    next();
                });
                */
                /* DELETE compressed but errors less detailed
                */
               User.findOneAndDelete({ _id: req.params.id })
                   .then(user => resp.send(204))
                   .catch(error => resp.send(500, error))

               next()
            })

            // Select server port to listen
            server.listen(8080, () => {
                console.log('API listening on 8080')
            })

        }).catch(console.error)