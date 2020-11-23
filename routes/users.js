const User = require('../models/users')

module.exports = function(server) {
    // API endpoints
    // GET index - all users
    server.get('/users', (req, resp, next) => {
        User.find()
        .then(users => {
            resp.json(users)
            next()
        })
    })
    
    // GET create - one user by id
    server.get('/users/:id', (req, resp, next) => {
        User.findById(req.params.id)
        .then(user => {
            if(user){
                resp.json(user)
            } else {
                resp.send(404)    // Not Found
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
            user.password = undefined   // don't show password
            resp.json(user)
        // * fazer uma checagem mais minuciosa no objeto de erro para imprimir o erro especifico e fazer um tratamento de erro mais rebuscado
        }).catch(error => {
            resp.status(400)    // Bad Request => Incomplete/Wrong Request (faltam dados ou enviado dados errados na requisição)
            resp.json({ message: error.message })
        })
        next()
    })

    // PUT update - replace all parameters ever
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
        let opts = { overwrite: true, returnOriginal: false }

        User.update({ _id: req.params.id }, req.body, opts)
            .exec().then(result => {
                if(result.n){
                    return User.findById(req.params.id)
                } else {
                    resp.send(404)
                }
            }).then(user => {
                resp.json(user) 
            })
        next()
    })

    // PATCH edit - replace one single parameter
    server.patch('/users/:id', (req, resp, next) => {
        let opts = { new: true }
        User.findByIdAndUpdate(req.params.id, req.body, opts)
            .then(user => {
                if(user){
                    resp.json(user)
                    next()
                }
                resp.send(404)
                next()
            })
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
            .then(user => resp.send(204))       // 204: No Content
            .catch(error => resp.send(404, error))
        next()
    })
}