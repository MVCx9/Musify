'use strict'

//Cargamos las librerias de sistemas de ficheros
var path = require('path');
var fs = require('fs');

//Cargamos los modelos de nuestro API REST
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/songs');


function getArtist(req, res){

    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }

        if(!artist){
            return res.status(500).send({
                message: 'El artista no existe'
            });
        }

        res.status(200).send({
            artist
        });
    });  
}

function saveArtist(req, res){

    var params = req.body;
    var artist = new Artist();

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    
    artist.save((err, artistStored) => {
        if(err){
            return res.status(500).send({
                message: 'Error al guardar el artista'
            });
        }

        if(!artistStored){
            return res.status(500).send({
                message: 'El artista no ha sido guardado'
            });
        }

        return res.status(200).send({
            message: 'El artista ha sido guardado correctamente',
            Artista: artistStored
        });

    });
}

function getAllArtist(req, res) {

    var page = req.params.page ? req.params.page : 1;
    var itemsPerPage = 6;

    Artist.paginate(
        {}, 
        {
            sort: { name: 'asc' }, 
            page: page, 
            limit: itemsPerPage 
        }, 
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    message: "Error en la petición al obtener los artistas"
                });
            }
        
            if (result.totalDocs === 0) {
                return res.status(404).send({
                    message: "No hay artistas",
                });
            }
        
            return res.status(200).send({
                total_artistas: result.totalDocs,
                total_pages: result.totalPages,
                artists: result.docs,
            });
        }
    );
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, {new: true}, (err, artistUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de actualizar el artista'
            });
        }

        if(!artistUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el artista'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el artista correctamente',
            artistUpdated
        });
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de borrar el artista'
            });
        }

        if(!artistRemoved){
            return res.status(404).send({
                message: 'No se ha podido borrar el artista'
            });
        }

        res.status(200).send({
            message: 'Se ha borrado el artista correctamente',
            artistRemoved
        });

        Album.find({artist: artistRemoved._id}).remove( (err, albumRemoved) => {
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
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
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

    Artist.findByIdAndUpdate(artistId, {image: fileName}, {new: true}, (err, artistUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error al actualizar el artista'
            });
        }

        if(!artistUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el artista'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el artista correctamente',
            artistUpdated
        });
    });
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var pathFile = './uploads/artist/'+imageFile;

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
    getArtist,
    saveArtist,
    getAllArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};