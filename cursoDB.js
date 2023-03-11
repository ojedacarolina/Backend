const mysql = require('mysql');
const config = require("config.json");
//const bcrypt =require('bcrypt');

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente");
    }
});

var cursoDb = {};

cursoDb.getAll = function (funCallback) {
    connection.query("SELECT * FROM curso", function (err, result) {
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

cursoDb.getById = function (cursoID,funCallback) {
    connection.query("SELECT * FROM curso WHERE cursoID = ?",[cursoID], function (err, result) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador.",
                detail: err
            });
            console.error(err);
        } else {
            if(result.length>0){
                funCallback(undefined, result[0]);
            } else {
                funCallback({
                    message: "No se encontro el usuario.",                  
                });
            }           
        }
    });
}

cursoDb.create = function (curso, funCallback) {
    var query = 'INSERT INTO curso (nombre,descripcion,imagen,año,activo) VALUES (?,?,?,?,?)'
    var dbParams = [curso.nombre, curso.descripcion, curso.imagen, curso.año, curso.activo];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `Ya existe el curso ${curso.nombre}`,
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
                message: `Se creo el curso ${curso.nombre}`,
                detail: result
            });
        }
    });
}

cursoDb.inscripcion = function (curso, funCallback) {
    var query = 'INSERT INTO alumno-curso (aluId,cursoID) VALUES (?,?)';
    var dbParams = [alumno.aluId, curso.cursoID];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                funCallback({
                    message: `El alumno con dni ${alumno.dni} ya esta inscripto en este curso`,
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
                message: `Se inscribio en ${curso.nombre}`,
                detail: result
            });
        }
    });
}

cursoDb.update = function (cursoID, curso, funCallback) {
    var query = 'UPDATE curso SET nombre = ?, descripcion = ?, imagen = ?, año = ?, activo = ? WHERE cursoID = ?';
    var dbParams = [curso.nombre, curso.descripcion, curso.imagen, curso.año, curso.activo, cursoID];
    connection.query(query, dbParams, function (err, result) {
        if (err) {
            funCallback({
                code:3,
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code:2,
                    message: `No se encontro el curso ${cursoID} ${curso.nombre}`,
                    detail: result
                });
            } else {
                funCallback({
                    code:1,
                    message: `Se modifico el curso ${cursoID} ${curso.nombre}`,
                    detail: result
                });
            }
        }
    });
}

cursoDb.eliminar = function(cursoID,funCallback){
    var query = 'DELETE  f FROM curso AS f JOIN alumno_curso AS dsy ON dsy.cursoID = f.cursoID WHERE f.cursoID =  ?'
    connection.query(query, cursoID, function (err, result) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador.",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,{
                    message: `No se encontro el curso ${cursoID} ${curso.nombre}`,
                    detail: result
                });
            } else {
                funCallback(undefined,{
                    message: `Se elimino el curso ${cursoID} ${curso.nombre}`,
                    detail: result
                })
            }
        }
    });
}


module.exports = cursoDb;