const Category = require('../models/category');

module.exports = {
    
    async create(req, res, next) {

        try {
            
            const category = req.body;

            const data = await Category.create(category);            
            
            return res.status(201).json({
                data: data.id,
                success: true,
                message: 'Se registro correctamente la categoria'
            })            

        } catch (error) {

            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar la categoría'
            })

        }
    }
}