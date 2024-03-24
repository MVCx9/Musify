'use strict'

//Definimos mongoose para acceder a la BBDD
var mongoose = require('mongoose');

//Definimos el schema para declarar el "esquema de la entidad"
var Schema = mongoose.Schema;

//Cada album hace referencia con un artista, buscará el objeto Artist con la referencia que tenga el artista
var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref: 'Artist'}
});

module.exports = mongoose.model('Album', AlbumSchema);
