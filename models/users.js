const mongoose = require('mongoose')

// Schema to database
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
        minlength: 4,
        select: false       // by default don't show password
    },
    role: {
        type: String,
        required: true,
        enum: ['Administrador', 'Atendimento', 'Certidão', 'Registro']
    }
})

// Model
const User = mongoose.model('User', UserSchema)

module.exports = User