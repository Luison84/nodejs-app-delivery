const CategoryController = require('../controllers/categoryController');
const passport = require('passport');

module.exports = (app) => {

    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }),CategoryController.create);
 
}