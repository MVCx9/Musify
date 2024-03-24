'use strict'

//Definimos mongoose para acceder a la BBDD
var mongoose = require('mongoose');
//Definimos el schema para declarar el "esquema de la entidad"
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);

