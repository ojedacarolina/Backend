const mysql = require('mysql');
const config = require("config.json");
const bcrypt = require('bcrypt'); 

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente");
    }
});


var usuarioDb = {};

usuarioDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM usuario", function (err, result) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador.",
                detail: err
            });
            console.error(err);
        } else {
            funCallback(undefined, result);
        }
    });
}

usuarioDb.create = function (usuario, funCallback) {
    let passwordHashed = bcrypt.hashSync(usuario.password,10); 
    var query = 'INSERT INTO usuario (email,nickname,password,rol) VALUES (?,?,?,?)';
    var dbParams = [usuario.email, usuario.nickname, passwordHashed, usuario.rol];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe un usuario con el email ${usuario.email}`,
                    detail: err
                });
            }else{
                funCallback({
                    message: "Surgio un problema, contactese con un administrador.",
                    detail: err
                });
            }           
            console.error(err);
        } else {
            funCallback(undefined, {
                message: `Se creo el usuario ${usuario.nickname}`,
                detail: result
            });
        }
    });
}

usuarioDb.update = function (nickname, usuario, funCallback) {
    let passwordHashed = bcrypt.hashSync(usuario.password,10);
    var query = 'UPDATE usuario SET email = ? , nickname = ?, password = ?, rol = ? WHERE nickname = ?'
    var dbParams = [usuario.email, usuario.nickname, passwordHashed, usuario.rol, nickname];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            funCallback({
                code:3,
                message: "Surgio un problema, intente de nuevo mas tarde o contactese con el administrador.",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code:2,
                    message: `No se encontro el usuario registrado con el correo ${email}`,
                    detail: result
                });
            } else {
                funCallback({
                    code:1,
                    message: `Se modifico el usuario ${email}`,
                    detail: result
                });
            }
        }
    });
}

usuarioDb.findByNickname = function (nickname,funCallback) {
    connection.query("SELECT * FROM usuario WHERE nickname = ?",[nickname], function (err, result) {  
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if(result.length>0){
                funCallback(undefined, result[0]);
            }else{
                funCallback({
                    message: "No se encontro el usuario"
                });
            }           
        }
    })
}

/*
usuarioDb.eliminar = function(userID,funCallback){
    let passwordHashed = bcrypt.hashSync(usuario.password,10);
    var query = 'DELETE FROM usuario WHERE userID = ?, password = ?';
    var dbParams = [userID, passwordHashed];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador.",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,{
                    message: `No se encontro el usuario ${userID}`,
                    detail: result
                });
            } else {
                funCallback(undefined,{
                    message: `Se elimino el usuario ${userID}`,
                    detail: result
                });
            }
        }
    });
}
*/

module.exports = usuarioDb;