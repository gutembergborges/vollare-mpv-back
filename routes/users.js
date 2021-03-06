const User = require('../models/users')
const NotFoundError = require('restify-errors')

module.exports = function(server) {
    // API endpoints
    // GET index - all users
    server.get('/users', (req, resp, next) => {
        User.find()
        .then(users => {
            resp.json(users)
            next()
        })
        .catch(next)
    })
    
    // GET create - one user by id
    server.get('/users/:id', (req, resp, next) => {
        User.findById(req.params.id)
        .then(user => {
            if(user){
                resp.json(user)
            } else {
                throw new NotFoundError('Usuário não encontrado')
            }
            next()
        })
        .catch(next)
    })

    // POST store
    server.post('/users', (req, resp, next) => {
        let user = new User(req.body)   // receiving parameters from request body
        
        user.save()
        .then(user => {
            user.password = undefined   // don't show password
            resp.json(user)
        // * fazer uma checagem mais minuciosa no objeto de erro para imprimir o erro especifico e fazer um tratamento de erro mais rebuscado
        })
        .catch(next)
        next()
    })

    // PUT update - replace all parameters ever
    server.put('/users/:id', (req, resp, next) => {  
        let opts = { overwrite: true, returnOriginal: false, runValidators: true }

        User.update({ _id: req.params.id }, req.body, opts)
            .exec().then(result => {
                if(result.n){
                    return User.findById(req.params.id)
                } else {
                    throw new NotFoundError('Usuário não encontrado')
                }
            })
            .then(user => {
                resp.json(user) 
            })
            .catch(next)
        next()
    })

    // PATCH edit - replace one single parameter
    server.patch('/users/:id', (req, resp, next) => {
        let opts = { new: true, runValidators: true }
        User.findByIdAndUpdate(req.params.id, req.body, opts)
            .then(user => {
                if(user){
                    resp.json(user)
                    next()
                }
                throw new NotFoundError('Usuário não encontrado')
                next()
            })
            .catch(next)
    })

    // DELETE destroy
    server.del('/users/:id', (req, resp, next) => {
        User.findOneAndDelete({ _id: req.params.id })
            .then(user => { throw new NotFoundError('Usuário não encontrado') })       // 204: No Content
            .catch(next)
        next()
    })
}