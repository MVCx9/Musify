'use strict'

var express = require('express');
//Cargamos el controlador de usuario
var ArtistController = require('../controllers/artist');
//Cargamos los middlewares
var md_auth = require('../middlewares/authenticated')
//Carga de ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artist'});

var api = express.Router();

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getAllArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/update-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;