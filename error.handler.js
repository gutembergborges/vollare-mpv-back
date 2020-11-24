const { deleteOne } = require("./models/users");
const restify = require('restify')

// Creating a function to handle exceptions and errors
module.exports = function handleError(req, resp, err, done) {
    
    // API always awaits receive a JSON
    err.toJSON = ()=>{
        return {
            message: err.message
        }
    }
    // Hanhle errors by name
    switch(err.name){           // ERROR 400: Bad Request
        case 'MongoError':      // To unique params duplicated and others
            if(err.code === 11000){
                err.statusCode = 400
            }
            break
        case 'ValidationError':  // To required and wrong params
            err.statusCode = 400
            break
    }
    done()
}