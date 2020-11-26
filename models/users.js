const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../config')

// User Database Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        select: false      // by default don't show password
    },
    role: {
        type: String,
        required: true,
        enum: ['Administrador', 'Atendimento', 'Certidão', 'Registro']
    }
})

// Middlewares to encryptate password:
function hashPassword(obj, next) {
    bcrypt.hash(obj.password, config.security.saltRounds)
          .then(hash => {
            obj.password = hash
            next()
        }).catch(next)
}

function saveMiddleware(next) {
    // If password don't modificated
    if(!this.isModified('password')){   // this = UserSchema
        next()
    } else {
        hashPassword(this, next)
    }
}

function updateMiddleware(next) {
    // There aren't parameter password in update payload/object
    if(!this.getUpdate().password){
        next()
    } else {
        hashPassword(this.getUpdate(), next)
    }
}
// in save method
UserSchema.pre('save', saveMiddleware)
// in findOneAndUpdate method (serves to findByIdAndUpdate too)
UserSchema.pre('findOneAndUpdate', updateMiddleware)
// in update method using in PUT
UserSchema.pre('update', updateMiddleware)

// Model
const User = mongoose.model('User', UserSchema)

module.exports = User