const mysql = require('mysql');
const config = require("config.json");


var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente");
    }
});

var alumnoDb = {};

alumnoDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM alumno ORDER BY apellido ASC", function (err, result) {
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

alumnoDb.create = function (alumno, funCallback) {
    var query = 'INSERT INTO alumno (nombre,apellido,dni,userID) VALUES (?,?,?,?)';
    var dbParams = [alumno.nombre, alumno.apellido, alumno.dni, alumno.userID];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe la persona DNI ${alumno.dni}`,
                    detail: err
                });
            }else{
                funCallback({
                    message: "Surgio un problema, contactese con un administrador. Gracias",
                    detail: err
                });
            }           
            console.error(err);
        } else {
            funCallback(undefined, {
                message: `Se creo la persona ${alumno.apellido} ${alumno.nombre}`,
                detail: result
            });
        }
    });
}

alumnoDb.update = function (aluID, alumno, funCallback) {
    var query = 'UPDATE alumno SET nombre = ?, apellido = ?, dni = ?, userID = ? WHERE aluID = ?';
    var dbParams = [alumno.nombre, alumno.apellido, alumno.dni, alumno.userID, aluID];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            funCallback({
                code:3,
                message: "Surgio un problema, contactese con un administrador.",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code:2,
                    message: `No se encontro el alumno ${aluID}`,
                    detail: result
                });
            } else {
                funCallback({
                    code:1,
                    message: `Se modifico el alumno ${alumno.apellido} ${alumno.nombre}`,
                    detail: result
                });
            }
        }
    });
}

alumnoDb.delete = function(aluID,funCallback){
    var query = 'DELETE FROM alumno WHERE aluID = ?';
    connection.query(query, aluID, function (err, result) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con el administrador o intentelo de nuevo mas tarde.",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,{
                    message: `No se encontro el alumno ${aluID}`,
                    detail: result
                });
            } else {
                funCallback(undefined,{
                    message: `Se elimino el alumno ${aluID}`,
                    detail: result
                });
            }
        }
    });
}


module.exports = alumnoDb;