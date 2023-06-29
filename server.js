const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors =require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

/**
INICIALIZAR FIREBASE ADMIN
*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

const usersRoutes = require('./routes/usersRoutes');

const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 3000;

/*Configuracion del Servidor */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());

app.disable('x-powered-by');

app.set("port", port);

/*
LLAMANDO A LAS RUTAS:
 */
usersRoutes(app, upload);


server.listen(port, () => {
    console.log("Aplicacion de Node JS " + port + " iniciada.......");
});


//ERROR
app.use((err,req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
})

module.exports = {
    'app' : app,
    'server' : server
}