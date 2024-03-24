'use strict'

//Cargamos las librerias de sistemas de ficheros
var path = require('path');
var fs = require('fs');

//Cargamos los modelos de nuestro API REST
var Album = require('../models/album');
var Song = require('../models/songs');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec( (err, song) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de obtener una canción'
            });
        }

        if(!song){
            return res.status(404).send({
                message: 'La canción no existe'
            });
        }

        return res.status(200).send({
            song
        });
    });  
}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err) {
            return res.status(500).send({
                message: 'Error en la petición de guardar la canción'
            });
        }

        if(!songStored) {
            return res.status(404).send({
                message: 'Error al guardar la canción'
            });
        }

        return res.status(200).send({
            message: 'Canción añadida correctamente',
            songStored
        });
    });
}

function getSongsFromAlbum(req, res) {

    var albumId = req.params.artist;

    //Sacamos todos los albums de la bbdd
    if(!albumId) {
        var find = Song.find({}).sort({album: 1, number: 1});
    } else {
        var find = Song.find({album: albumId}).sort({album: 1, number: 1});
    }

    find.populate({
        path: 'album', //Rellename la info del album
        populate: { //además dentro de este album, rellename la info del artista
            path: 'artist',
            model: 'Artist'
        }
    }).exec( (err, songs) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de obtener las canciones'
            });
        }

        if(!songs){
            return res.status(404).send({
                message: 'No existen canciones'
            });
        }

        return res.status(200).send({
            songs
        });
    });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var songDataToUpdate = req.body;

    Song.findByIdAndUpdate(songId, songDataToUpdate, {new: true}, (err, songUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de obtener una cación∫'
            });
        }

        if(!songUpdated){
            return res.status(404).send({
                message: 'No se ha modificado la canción porque no existe'
            });
        }

        return res.status(200).send({
            message: 'Canción modificada correctamente',
            songUpdated
        });
    })

}

function deleteSong(req, res) {

    var songId = req.params.id;

    Song.findByIdAndDelete(songId, (err, songRemoved) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de borrar la canción'
            });
        }

        if(!songRemoved){
            return res.status(404).send({
                message: 'No se ha podido borrar la canción'
            });
        }

        return res.status(200).send({
            message: 'Se ha borrado la canción correctamente',
            songRemoved
        });
    });
}

function uploadSongFile(req, res) {
    var songId = req.params.id;
    var fileName = 'Imagen no subida';

    if(!req.files){
        return res.status(200).send({
            message: 'No se ha subido ninguna imagen'
        });
    }

    // Cargamos el modulo path
    var path = require('path');

    // obtener la ruta del archivo de req.files.image
    var filePath = req.files.file.path;
    // utilizar path.sep para dividir la ruta de archivo en partes
    var fileSplit = filePath.split(path.sep);
    var fileName = fileSplit[fileSplit.length - 1];

    var fileExtSplit = fileName.split('.');
    var fileExt = fileExtSplit[fileExtSplit.length - 1];

    if(!fileExt == 'mp3' || !fileExt == 'ogg'){
        return res.status(200).send({
            message: 'Extensión del archivo no válida'
        });
    }

    Song.findByIdAndUpdate(songId, {file: fileName}, {new: true}, (err, songUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición al actualizar la canción'
            });
        }

        if(!songUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar la canción'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado y añadido el fichero a la canción correctamente',
            songUpdated
        });
    });
}

function getSongFile(req, res){

    var imageFile = req.params.songFile;
    var pathFile = './uploads/songs/' + imageFile;

    fs.access(pathFile, fs.constants.F_OK, function(err) {
        if (err) {
            // El archivo no existe
            return res.status(200).send({
                message: 'La cación no existe',
            });
        }
    
        return res.sendFile(path.resolve(pathFile));
    });    
}

module.exports = {
    getSong,
    saveSong,
    getSongsFromAlbum,
    updateSong,
    deleteSong,
    uploadSongFile,
    getSongFile
};