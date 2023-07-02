const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors =require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const session = require('express-session');

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
const categoriesRoutes = require('./routes/categoriesRoutes');

const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 5000;

/*Configuracion del Servidor */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');

app.set("port", port);

/*
LLAMANDO A LAS RUTAS:
 */
app.get('/', (req, res) => {
    return res.json({
        'msg': 'Ruta Principal del Proyecto'
    })
});

usersRoutes(app, upload);
categoriesRoutes(app);

server.listen(port,() => {
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