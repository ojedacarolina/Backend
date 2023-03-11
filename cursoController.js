require("rootpath")();
const express = require('express');
const app = express();

const cursoDb = require("cursoDB.js");


app.get('/', getAll);
app.get('/ById', getById);
app.post('/', create);
app.post('/inscribir', inscripcion);
app.put('/:cursoID', update);
app.delete('/:cursoID', eliminar);


function getAll(req, res) {
    cursoDb.getAll(function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function getById(req, res) {
    cursoDb.getById(req.params.cursoID,function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function create(req, res) {
    cursoDb.create(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function inscripcion(req, res) {
    cursoDb.inscripcion(req.body, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}

function update(req, res) {
    cursoDb.update(req.params.cursoID, req.body, function (result) {
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
    cursoDb.eliminar(req.params.cursoID, function (err, result) {
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