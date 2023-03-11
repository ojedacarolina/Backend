require("rootpath")();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioDb = require("usuarioDB.js");


app.post("/login", login);  


function login(req, res) {
    const { nickname, password } = req.body;  
    usuarioDb.findByNickname(nickname, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            const iguales = bcrypt.compareSync(password, result.password);
            if (iguales) {
                let user = {
                    nickname: result.nickname,
                    email: result.email,
                    rol: result.rol
                }
                jwt.sign(user, 'siliconsecret', { expiresIn: '10s' }, (err, token) => {
                    if (!err) {
                        res.json({
                            datos: user,
                            token: token
                        });
                    } else {
                        res.status(500).send(err);
                    }
                })
            } else {
                res.status(400).send({
                    message: "Password incorrecta"
                });
            }
        }
    });
}

function verificarToken(req, res, next) {
    if(!req.headers["authorization"]){
        res.status(403).send("No se recibio header autentication");
    }else{
        try {
            const token = req.headers["authorization"];
            const verified = jwt.verify(token, "siliconsecret");
            if(verified){
                next();
            }else{
                res.status(403).send("Error autentication");
            }
        } catch (error) {
            res.status(403).send("Error autentication");
        }
    }
}

module.exports = {app,verificarToken};
 