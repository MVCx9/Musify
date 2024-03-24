'use strict'

var express = require('express');
//Cargamos el controlador de usuario
var SongController = require('../controllers/song');
//Cargamos los middlewares
var md_auth = require('../middlewares/authenticated')
//Carga de ficheros
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongsFromAlbum);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/update-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadSongFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);

module.exports = api;