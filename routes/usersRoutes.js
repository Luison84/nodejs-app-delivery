const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {

    //OBTENER DATOS DE USUARIOS
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/getAll2', UsersController.getAll);
    app.get('/api/users/findByUserId/:id',passport.authenticate('jwt', {session:false}), UsersController.findByUserId);

    //app.post('/api/users/create', upload.array('image', 1) ,UsersController.register);
    app.post('/api/users/create', upload.array('image', 1) ,UsersController.registerWithImage);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/logout', UsersController.logout);

    //RUTA PARA ACTUALIZAR DATOS
    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1) ,UsersController.update);
    
}