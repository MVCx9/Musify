'use strict'

//Definimos mongoose para acceder a la BBDD
var mongoose = require('mongoose');
//Definimos mongoose-paginate para paginar el schema
var mongoosePaginate = require('mongoose-paginate-v2');

//Definimos el schema para declarar el "esquema de la entidad"
var ArtistSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

//activar paginado
ArtistSchema.plugin(mongoosePaginate);

//exportar módulo
module.exports = mongoose.model('Artist', ArtistSchema);
