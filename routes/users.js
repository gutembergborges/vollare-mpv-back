const User = require('../models/users')

module.exports = function(server) {
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
}