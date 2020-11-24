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
        maxlength: 30,
        minlength: 4      // by default don't show password
    },
    role: {
        type: String,
        required: true,
        enum: ['Administrador', 'Atendimento', 'Certidão', 'Registro']
    }
})

// Middlewares to encryptate password:
// in save method
UserSchema.pre('save', function(next){
    // this = UserSchema
    // If password don't modificated
    if(!this.isModified('password')){
        next()
    } else {
        bcrypt.hash(this.password, config.security.saltRounds)
              .then(hash => {
                this.password = hash
                next()
              }).catch(next)
    }
})

// in findOneAndUpdate method (serves to findByIdAndUpdate too)
UserSchema.pre('findOneAndUpdate', function(next){
    // this = UserSchema
    // There aren't parameter password in update payload/object
    if(!this.getUpdate().password){
        next()
    } else {
        bcrypt.hash(this.getUpdate().password, config.security.saltRounds)
              .then(hash => {
                this.getUpdate().password = hash
                next()
              }).catch(next)
    }
})

// Model
const User = mongoose.model('User', UserSchema)

module.exports = User