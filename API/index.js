'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//When strict option is set to true , Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database, 
//and all other fields will not be saved (if some other fields are sent). In simple term, the strict option, ensures that values passed to 
//our model constructor that were not specified in our schema do not get saved to the db. Mongoose supports a separate strictQuery option 
//to avoid strict mode for query filters. This is because empty query filters cause Mongoose to return all documents in the model, 
//which can cause issues.
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/musify', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Conexión a la base de datos realizada correctamente...")

        app.listen(port, function(){
            console.log("Servidor del API REST de Musify escuchando en http://localhost:"+port);
        })
    }
});