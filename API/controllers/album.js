'use strict'

//Cargamos las librerias de sistemas de ficheros
var path = require('path');
var fs = require('fs');

//Cargamos los modelos de nuestro API REST
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/songs');

function getAlbum(req, res){

    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec( (err, album) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de obtener un album'
            });
        }

        if(!album){
            return res.status(404).send({
                message: 'El album no existe'
            });
        }

        return res.status(200).send({
            album
        });
    });  
    
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err) {
            return res.status(500).send({
                message: 'Error en la petición de guardar el album'
            });
        }

        if(!albumStored) {
            return res.status(404).send({
                message: 'Error al guardar el album'
            });
        }

        return res.status(200).send({
            message: 'Album creado correctamente',
            albumStored
        });
    });
}

function getAlbumsFromArtist(req, res) {

    var artistId = req.params.artist;

    //Sacamos todos los albums de la bbdd
    if(!artistId) {
        var find = Album.find({}).sort('title');
    } else {
        var find = Album.find({artist: artistId}).sort({year: 1});
    }

    find.populate({path: 'artist'}).exec( (err, albums) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de obtener un album'
            });
        }

        if(!albums){
            return res.status(404).send({
                message: 'No existen albums'
            });
        }

        return res.status(200).send({
            albums
        });
    });
}

function updateAlbum(req, res) {
    
    var albumId = req.params.id;
    var albumDataForUpdate = req.body;

    Album.findByIdAndUpdate(albumId, albumDataForUpdate, {new: true})
    .populate({path: 'artist'}).exec( (err, albumUpdated) => {

        if(err){
            return res.status(500).send({
                message: 'Error en la petición de actualizar el album'
            });
        }

        if(!albumUpdated){
            return res.status(404).send({
                message: 'No hay se ha podido actualizar el album porque no existe'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el album correctamente',
            albumUpdated
        });
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId).populate({path: 'artist'}).exec( (err, albumRemoved) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de borrar el album'
            });
        }

        if(!albumRemoved){
            return res.status(404).send({
                message: 'No se ha podido borrar el album'
            });
        }

        res.status(200).send({
            message: 'Se ha borrado el album correctamente',
            albumRemoved
        });


        Song.find({album: albumRemoved._id}).remove( (err, songRemoved) => {
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
        
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var fileName = 'Imagen no subida';

    if(!req.files){
        return res.status(200).send({
            message: 'No se ha subido ninguna imagen'
        });
    }

    // Cargamos el modulo path
    var path = require('path');

    // obtener la ruta del archivo de req.files.image
    var filePath = req.files.image.path;
    // utilizar path.sep para dividir la ruta de archivo en partes
    var fileSplit = filePath.split(path.sep);
    var fileName = fileSplit[fileSplit.length - 1];

    var fileExtSplit = fileName.split('.');
    var fileExt = fileExtSplit[fileExtSplit.length - 1];

    if(!fileExt == 'png' || !fileExt == 'jpg' || !fileExt == 'gif'){
        return res.status(200).send({
            message: 'Extensión del archivo no válida'
        });
    }

    Album.findByIdAndUpdate(albumId, {image: fileName}, {new: true}, (err, albumUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición al actualizar el album'
            });
        }

        if(!albumUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el album'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el album correctamente',
            albumUpdated
        });
    });
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;

    fs.access(pathFile, fs.constants.F_OK, function(err) {
        if (err) {
            // El archivo no existe
            return res.status(200).send({
                message: 'La imagen no existe',
            });
        }
    
        return res.sendFile(path.resolve(pathFile));
    });    
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbumsFromArtist,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};