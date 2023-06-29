const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {

    const sql = `
        SELECT
            *
        FROM
            users            
    `;

    return db.manyOrNone(sql);
}

User.create = (user) => {

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;
    
    const sql = `
    INSERT INTO users(email,password,name,lastname,phone,image,created_at,updated_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.password,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date(),
        new Date()
    ]);
}

User.findById = (id, callback) => {

    const sql = `select 
                        id,
                        email,
                        name,
                        lastname,
                        image,
                        phone,
                        password,
                        sesion_token
                    from
                        users
                    where id = $1`;
    
    return db.oneOrNone(sql,id).then(user => {callback(null,user)});
}

User.findByEmail = (email) => {

    const sql = `
    select 
            U.id,
            U.email,
            U.name,
            U.lastname,
            U.image,
            U.phone,
            U.password,
            U.sesion_token,
            json_agg(
                json_build_object(
                    'id', R.id,
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                )
            )as roles
        from
            users AS U
        inner join 
            user_has_roles AS UHR
        on 
            U.id = UHR.id_user
        inner join 
            roles AS R
        on R.id = UHR.id_rol
        where email = $1
    group by U.id`;
    
    return db.oneOrNone(sql,email);
    
}

User.isPasswordMatched = (userPassword, hash) => {

    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');

    if(myPasswordHashed === hash){
        return true;
    }
    
    return false;
    
}

module.exports = User;