CREATE DATABASE integrador;
USE integrador;


CREATE TABLE usuario (
`userID` INT NOT NULL AUTO_INCREMENT,
`email` varchar(255) NOT NULL,
`nickname` varchar(50),
`password` varchar(200) NOT NULL,
`rol` varchar(50) NOT NULL,
PRIMARY KEY (`userID`)
);


CREATE TABLE alumno (
`aluID` INT NOT NULL AUTO_INCREMENT,
`nombre` varchar(255) NOT NULL,
`apellido` varchar(255) NOT NULL,
`dni` INT NOT NULL UNIQUE,
`userID` int,
  PRIMARY KEY (`aluID`),
  INDEX `userID` (`userID` ASC) VISIBLE,
  CONSTRAINT `alumno_ibfk_1`
    FOREIGN KEY (`userID`)
    REFERENCES `usuario` (`userID`)
    );


CREATE TABLE curso (
`cursoID` INT NOT NULL AUTO_INCREMENT,
`nombre` varchar(255) NOT NULL,
`descripcion` varchar(1000),
`imagen` varchar(1000),
`año` INT NOT NULL,
`activo` boolean,
PRIMARY KEY (`cursoID`)
);


CREATE TABLE alumno_curso (
  `aluID` INT,
  `cursoID` INT,
  INDEX `alumno_curso_ibfk_2` (`cursoID` ASC) VISIBLE,
  INDEX `alumno_curso_ibfk_1` (`aluID` ASC) VISIBLE,
  CONSTRAINT `alumno_curso_ibfk_1`
    FOREIGN KEY (`aluID`)
    REFERENCES `alumno` (`aluID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `alumno_curso_ibfk_2`
    FOREIGN KEY (`cursoID`)
    REFERENCES `curso` (`cursoID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    );


 insert into usuario (nickname,password,email,rol) values ('admin','$2a$12$QQE5Yl4IpoeFsIGnoJ6Gn.N9QN/Mu04jmxn79j.HhsWzPR1bqO19u','admin@admin.com','admin');
 insert into usuario (nickname,password,email,rol) values ('docente','$2a$12$4lKYFy58kyBpP50zX/eqH.A/Q.QiWxOfChkNEp7tgN3Mg/LxupapK','docente@docente.com','docente');

