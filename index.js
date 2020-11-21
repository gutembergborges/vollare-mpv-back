const restify = require ('restify')
const mongoose = require('mongoose')

// * criar um .env para guardar essas variáveis de ambiente e nao expô-las
// mongodb+srv://<username></username>:<password>@cluster0.y1xkp.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://cloudmongo:cloudmongo@cluster0.y1xkp.mongodb.net/vollare-mpv-backend', { useUnifiedTopology: true, useNewUrlParser: true })
        .then(_=>{
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
            server.get('/users', (req, resp, next)=>{
                User.find().then(users=>{
                    resp.json(users)
                    return next()
                })
            })
            
            // GET create - one user by id
            server.get('/users/:id', (req, resp, next)=>{
                
                User.findById(req.params.id).then(user=>{
                    if(user){
                        resp.json(user)
                    } else {
                        resp.status(404)
                        resp.json({message: 'not found'})
                    }
                    return next()
                })
            })

            // POST store
            server.post('/users', (req, resp, next)=>{
                let user = new User(req.body)   // receiving parameters from request body
                user.save().then(user=>{
                    resp.json(user)
                // * fazer uma checagem mais minuciosa no objeto de erro para imprimir o erro especifico
                }).catch(error=>{
                    resp.status(400)    // Bad Request => Incomplete Request (faltam dados da requisição)
                    resp.json({message: error.message})
                })
            })

            // Select server port to listen
            server.listen(8080, ()=>{
                console.log('API listening on 8080')
            })
        }).catch(console.error)