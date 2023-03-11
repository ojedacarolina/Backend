require("rootpath")();
const express = require('express');
const app = express();

const alumnoDb = require("alumnoDB.js");
const securityCont = require("security.js");


app.get('/', securityCont.verificarToken, getAll);
app.post('/', securityCont.verificarToken, create);
app.put('/:aluID', securityCont.verificarToken, update);
app.delete('/:aluID', securityCont.verificarToken, eliminar);

function getAll(req, res) {
    alumnoDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function create(req, res) {
    alumnoDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    alumnoDb.update(req.params.aluID, req.body, function (result) {
        if (result.code == 3) {
            res.status(500).send(err);
        } else if (result.code == 2) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    });
}

function eliminar(req, res) {
    alumnoDb.delete(req.params.aluID, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).json(result);
            } else {
                res.json(result);
            }
        }
    });
}

module.exports = app;