require("rootpath")();
const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require("config.json");
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');
  

const alumnoCont = require("alumnoController.js");
const cursoCont = require("cursoController.js");
const usuarioCont = require("usuarioController.js");
const securityCont = require("security.js");
app.use("/apis/alumno",alumnoCont);
app.use("/apis/curso",cursoCont);
app.use("/apis/usuario",usuarioCont);
app.use("/apis/security",securityCont.app);

app.listen(config.server.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server iniciado en puerto:${config.server.port}`);
    }
});
