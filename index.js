const restify = require ('restify')
const mongoose = require('mongoose')

// criar um .env para guardar essas variáveis de ambiente e nao expô-las
// mongodb+srv://<username></username>:<password>@cluster0.y1xkp.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://cloudmongo:cloudmongo@cluster0.y1xkp.mongodb.net/vollare-mpv-backend')
        .then(_=>{
            const server = restify.createServer({
                name: 'vollare-mpv-back',
                version: '0.0.1'
            })
            
            // Schema to database
            const userSchema = new mongoose.Schema({
                name: {
                    type: String,
                    required: true
                }
            })

            // Model
            const User = mongoose.model('User', userSchema)
            
            server.get('/users', (req, resp, next)=>{
                resp.json(users)
            })
            
            server.get('/users/:id', (req, resp, next)=>{
                const filtered = users.filter(user => user.id === req.params.id)
                if(filtered.length){
                    resp.json(filtered[0])
                } else {
                    resp.status(404)
                    resp.json({message: 'not found'})
                }
                return next()
            })
            
            server.listen(8080, ()=>{
                console.log('API listening on 8080')
            })
        }).catch(console.error)