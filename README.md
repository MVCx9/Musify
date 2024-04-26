<h1 align="center"> Musify, una aplicación musical 🎶</h1>
  
<p align="center">
    <img src="https://img.shields.io/badge/STATUS-EN%20DESAROLLO-yellow">
</p>

Este proyecto es una aplicación reproductora de música que permite almacenar información sobre cantantes, álbumes y canciones de dichos álbumes. La aplicación consta de un servicio de API REST implementado en Node.js con autenticación mediante JWT (JSON Web Tokens), y una interfaz de usuario construida con Angular.

<p align="center">
    <img width=500 src="utils/musify_logo.jpeg">
</>

## Características principales
- Gestión de cantantes: Permite agregar, editar y eliminar información sobre cantantes.
- Gestión de álbumes: Permite agregar, editar y eliminar información sobre álbumes, asociándolos con sus respectivos cantantes.
- Gestión de canciones: Permite agregar, editar y eliminar información sobre canciones, asociándolas con sus respectivos álbumes.
- Autenticación segura: Utiliza JWT para autenticar usuarios y garantizar la seguridad de la aplicación.
- Interfaz de usuario amigable: La interfaz de usuario desarrollada con Angular proporciona una experiencia fluida y fácil de usar para los usuarios.

## Instalación

*** PASOS PARA INICIAR LA APLICACIÓN ***

1. Iniciar el servicio  mongodb (donde almacenaremos los datos de nuestra musica): 
    - brew services start mongodb-community
2. Iniciar el servidor de bbdd: 
    - mongod
3. Iniciar la aplicación API REST de Musify: 
    - cd /Users/Miguel/Desktop/Valadev/Musify/API
    - npm start
4. Iniciar aplicación frontal:
    - cd /Users/Miguel/Desktop/Valadev/Musify/CLIENT/frontal-Musify
    - ng serve

(/Users/Miguel/Desktop/Valadev/Musify/ es donde almaceno la aplicación en mi máquina local)

*** PASOS PARA PARAR LA APLICACIÓN ***

1. Hacer CONTROL + C en la ventana donde esté lanzada la aplicación (npm start)
2. Parar el servicio: 
    - brew services stop mongodb-community

## APUNTES

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
- Info de Angular-CLI: https://angular.io/cli
- Para crear un proyecto de Angular-CLI
    - sudo npm install -g @angular/cli
    - ng new <project-name>

- Operator map
    - Si en Angular 6 te genera algun fallo la libreria map, importala de esta manera en tu servicio:
        - import {map} from 'rxjs/operators';
        
        Y usala de esta manera:
        - .pipe(map(res => res.json())); 


- En Angular 6 al importar Observable en nuestros servicios: import { Observable } from 'rxjs/Observable';
    
    - rxjs/Observable -> Puede ser que nos devuelva un error por la consola de comandos, algo como esto: ERROR in node_modules/rxjs/Observable.d.ts(1,15): error TS2307: Cannot find module 'rxjs-compat/Observable'.

        Para solucionarlo tenemos que cortar la ejecución de nuestro servidor local de desarrollo de Angular pulsando Ctrl+C y ejecutamos este comando para instalar una libreria que falta:

        - npm install --save rxjs-compat

        Después arrancamos de nuevo nuestro proyecto de Angular con el comando:

        - ng serve
        
        y todo estará listo.     

