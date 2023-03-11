require("rootpath")();
const express = require('express');
const app = express();

const usuarioDb = require("usuarioDb.js");
const securityCont = require("security.js");

app.get('/',securityCont.verificarToken, getAll);
app.post('/',securityCont.verificarToken, create);
app.put('/:nickname',securityCont.verificarToken, update);



function getAll(req, res) {
    usuarioDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function create(req, res) {
    usuarioDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    usuarioDb.update(req.params.nickname, req.body, function (result) {
        if (result.code == 3) {
            res.status(500).send(err);
        } else if (result.code == 2) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    });
}

module.exports = app;