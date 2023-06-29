const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Rol = require('../models/rol');
const storage = require('../utils/cloud_storage');

module.exports = {
    
    async getAll(req, res, next) {

        try {
            
            const data = await User.getAll();
            // console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);

        } catch (error) {

            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            })

        }
    },

    async register(req, res, next) {

        try {
            
            const user = req.body;

            //REGISTRANDO AL USUARIO EN LA BD
            const data = await User.create(user);

            //REGISTRANDO EL ROL POR DEFECTO AL USUARIO EN LA BD
            await Rol.create(data.id, 1);

            return res.status(201).json({
                success: true,
                message: 'El usuario se registro correctamente, ahora inicia sesion',
                data: data.id
            })

        } catch (error) {

            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario'
            })

        }
    },
    
    async registerWithImage(req, res, next) {

        try {
            
            const user = JSON.parse(req.body.user);
            console.log(user);

            const files = req.files;

            if(files.length > 0){
                const pathImage = `image_${Date.now() }`; //Nombre del archivo
                const url = await storage(files[0], pathImage);

                if(url != undefined && url != null){
                    user.image = url;
                }
            }

            //REGISTRANDO AL USUARIO EN LA BD
            const data = await User.create(user);

            //REGISTRANDO EL ROL POR DEFECTO AL USUARIO EN LA BD
            await Rol.create(data.id, 1);

            return res.status(201).json({
                success: true,
                message: 'El usuario se registro correctamente, ahora inicia sesion',
                data: data.id
            })

        } catch (error) {

            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario'
            })

        }
    },

    async login(req, res, next){

        try {

            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if(!myUser){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            if(User.isPasswordMatched(password, myUser.password)){
                const token = jwt.sign({
                    id: myUser.id, 
                    email: myUser.email
                }, keys.secretOrKey, {
                    // expiresIn: (60*60*24) //1hora
                });

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    sesion_token: `JWT ${token}`,
                    roles: myUser.roles
                }

                console.log(`USUARIO ENVIADO ${data}`);
                

                return res.status(201).json({
                    success: true,
                    message: 'Inicio de Sesion correcto',
                    data: data 
                })
            }else{
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                })
            }

        } catch (error) {
            console.log(`Error: ${error}`)
            
            return res.status(501).json({
                success: false,
                message: 'Error al iniciar sesion',
                error: error
            });
        }

    }
}