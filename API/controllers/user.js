'use strict'

//Cargamos el modelo de usuario
var User = require('../models/user');
//Cargamos el servicio de JWT
var jwt = require('../services/jwt');
//Cargamos la "libreria" para encriptar contraseñas
var bcrypt = require('bcrypt-nodejs');
//Cargamos librerias de gestión de fiheros
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del API REST con Node y Mongo'
    });
}

function saveUser(req, res){
    //Instanciamos el usuario
    var user = new User();

    //Obtenemos los datos que vengan body con los datos del usuario
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    //Si la pasw viene vacia, devolvemos error con mensaje
    if(params.password == null){
        return res.status(200).send({
            message: 'Introduce la contraseña'
        });
    }

    //Encriptar contraseña y guardar dato
    bcrypt.hash(params.password, null, null, function(err, hash){
        user.password = hash;

        //Comprobamos que todos los campos vienen informados
        if(user.name == null || user.surname == null || user.email == null){
            return res.status(200).send({
                message: 'Rellena todos los campos'
            });
        }

        //Guardamos el usuario en la BBDD
        user.save((err, userStored) => {
            if(err){
                return res.status(500).send({
                    message: 'Error al guardar el usuario'
                });
            }

            if(!userStored){
                return res.status(404).send({
                    message: 'No se ha registrado el usuario'
                });
            }

            return res.status(200).send({
                message: 'Se ha registrado correctamente al usuario',
                user: userStored
            });
        });
    });

}

function loginUser(req, res){
    //Instanciamos el usuario
    var user = new User();

    //Obtenemos los datos que vengan body con los datos del usuario
    var params = req.body

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {

        //Si ocurre algun error en la consulta, lanzamos 500 con mensaje
        if(err){
            return res.status(500).send({
            message: 'Error en la petición'
            });
        }

        //Si no se ha encontrado el usuario, mostramos error
        if(!user){
            return res.status(404).send({
                message: 'El usuario no existe'
            });
        }

        //Comprobamos la contraseña
        bcrypt.compare(password, user.password, function(err, check){
            
            //Si la comprobación ha fallado -> contraseña incorrecta
            if(!check){
                return res.status(404).send({
                    message: 'Contraseña incorrecta. El usuario no puede logearse'
                });
            }

            //Usuario logeado -> Devolver los datos del usuario logeado
            if(params.gethash == null){
                res.status(200).send({
                    message: 'El usuario se ha loggea correctamente, pero sin hash -> no tiene token',
                    user
                });
            }                

            //Usuario logeado -> Devolver datos usuario y token de JWT
            return res.status(200).send({
                message: 'Usuario logeado correctamente con su respectivo token',
                user,
                token: jwt.createToken(user)
            });
            
        });
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición de actualizar el usuario'
            });
        }

        if(!userUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el usuario'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el usuario correctamente',
            userUpdated
        });
    });
}

function uploadImage(req, res){
    var userID = req.params.id;
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

    User.findByIdAndUpdate(userID, {image: fileName}, {new: true}, (err, userUpdated) => {
        if(err){
            return res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        }

        if(!userUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el usuario'
            });
        }

        return res.status(200).send({
            message: 'Se ha actualizado el usuario correctamente',
            userUpdated,
        });
    });
    
}

function getImageFile(req, res){

    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/'+imageFile;

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
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};