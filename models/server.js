const express = require('express');
const cors = require('cors');
const {dbConnection} = require("../database/config");

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.productosPath = '/api/productos';
        this.uploadPath = '/api/uploads';

        //connect to DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.uploadPath, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server run in port ', this.port);
        });
    }

}


module.exports = Server;
