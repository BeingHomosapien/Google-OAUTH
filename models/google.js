const mongoose = require('mongoose')

const Schema = mongoose.Schema

const googleUser = new Schema({
    id:String,
    email: String,
    name: String
})

module.exports = mongoose.model("GoogleUser", googleUser)