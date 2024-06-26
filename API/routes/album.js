'use strict'

var express = require('express');
//Cargamos el controlador de usuario
var AlbumController = require('../controllers/album');
//Cargamos los middlewares
var md_auth = require('../middlewares/authenticated')
//Carga de ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

var api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbumsFromArtist);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/update-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);


module.exports = api;