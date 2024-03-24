*************************** PASOS PARA INICIAR LA APLICACIÓN ***************************

1. Iniciarel servicio  mongodb: 
    brew services start mongodb-community
2. Iniciar el servidor de bbdd: 
    mongod
3. Iniciar la aplicación siguiendo el index.js: 
    cd /Users/Miguel/Desktop/Valadev/Musify/API
    npm start
4. Iniciar aplicación frontal:
    cd /Users/Miguel/Desktop/Valadev/Musify/CLIENT/frontal-Musify
    ng serve

*************************** PASOS PARA PARAR LA APLICACIÓN ***************************

1. Hacer CONTROL + C en la ventana donde esté lanzada la aplicación (npm start)
2. Parar el servicio: 
    brew services stop mongodb-community

------ APUNTES ------

Lanzar la shell para ejecutar comandos en servidor BBDD: 
    mongosh

Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start.
Justo encima de la llamada a mongoose.connect
    mongoose.Promise = global.Promise;

Para desistalar o instalar dependencias: 
    cd /Users/Miguel/Desktop/Valadev/Musify
    npm uninstall xxxxxxxx
    npm install xxxxxxxx

ANGULAR-CLI
    - Info de Angular-CLI
    https://angular.io/cli
    
    - Para crear un proyecto de Angular-CLI
    sudo npm install -g @angular/cli
    ng new <project-name>




