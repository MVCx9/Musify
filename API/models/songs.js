'use strict'

//Definimos mongoose para acceder a la BBDD
var mongoose = require('mongoose');

//Definimos el schema para declarar el "esquema de la entidad"
var Schema = mongoose.Schema;

//Cada canción hace referencia con el album al que pertenece, buscará el objeto Album con la referencia que tenga el album
var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', SongSchema);
