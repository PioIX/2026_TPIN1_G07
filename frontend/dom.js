function getNombre(){
    return document.getElementById("ingreseNombre").value
}

function getMail(){
    return document.getElementById("ingreseMail").value
}

function getContraseña(){
    return document.getElementById("ingreseContraseña").value
}

//  DOM DE SESION
function getMailS(){
    return document.getElementById("ingreseMail").value
}

function getContraseñaS(){
    return document.getElementById("ingreseContraseña").value
}

// DOM DE ADMIN
function ingresoCategorias() {
    return document.getElementById("ingresoCategorias").value
}

function ingresoTextoPregunta() {
    return document.getElementById("ingresoTextoPregunta").value
}

// DOM DE RESPUESTAS

function ingresoRespuesta1() {
    return document.getElementById("ingresoRespuesta1").value;
}

function ingresoRespuesta2() {
    return document.getElementById("ingresoRespuesta2").value;
}

function ingresoRespuesta3() {
    return document.getElementById("ingresoRespuesta3").value;
}

function ingresoRespuesta4() {
    return document.getElementById("ingresoRespuesta4").value;
}

function getPreguntaSeleccionada() {
    return document.getElementById("selectorPregunta").value;
}

function getRespuestaCorrecta() {
    return document.querySelector('input[name="respuestaCorrecta"]:checked').value;
}

// DOM RESPUESTAS MODIFICADAS
function getIdRespuestaModificar() {
    return document.getElementById("selectorRespuesta").value;
}

function getTextoRespuestaModificar() {
    return document.getElementById("inputModificarRespuesta").value;
}

function getEsCorrectaModificar() {
    return document.querySelector('input[name="correctaModificar"]:checked').value;
}