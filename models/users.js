const mongoose = require('mongoose')

// Schema to database
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false       // by default don't show password
    },
    role: {
        type: String,
        required: true
    }
})

// Model
const User = mongoose.model('User', UserSchema)

module.exports = User