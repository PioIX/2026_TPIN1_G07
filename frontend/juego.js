function traerPreguntas(categoria) {
    iniciarJuegoPorCategoria(categoria)
}


// JUEGO:
/*
window.onload = function(){
    let categoriaDeJuego = localStorage.getItem("categoria_actual");

    if (categoriaDeJuego){
        console.log("Iniciando partida en la categoria", categoriaDeJuego);
        iniciarJuegoPorCategoria(categoriaDeJuego);
    }
};

async function registrarCategoriaDeRuleta(categoriaGanadora){
    localStorage.setItem("categoria_actual",categoriaGanadora);
    window.location.href =`${categoriaGanadora}.html`;
}
*/


async function iniciarJuegoPorCategoria(categoria) {
    try{
        
        // Hacemos el fetch al endpoint exacto que modificamos:
        const respuesta =await fetch('http://localhost:4000/Preguntas?categoria=' + categoria);
        const datos = await respuesta.json();

        const vectorPreguntas = datos.preguntas;
    //'datos.preguntas' trae el vector/arreglo de preguntas de MySQL
    //localStorage.setItem("preguntas", vector)
    // Usamos JSON.stringify porque localStorage solo guarda cadenas de texto plano
        localStorage.setItem("preguntas",JSON.stringify(vectorPreguntas));
        // contador de preguntas en 0
        localStorage.setItem("preguntas_respondidas", "0")
        
        mostrarPreguntaAleatoria();
    }catch(error){
        console.error("Error no pudieron obtenerse los datos", error);
    }
}


async function obtenerRespuestasPorPreguntas(idPregunta){
    try{
        const respuesta = await fetch('http://localhost:4000/Respuestas?id_preguntas=' + idPregunta)
        const datos = await respuesta.json();
        return datos;
    }catch (error){
        console.error("No se obtuvo la respuesta",error);
        return [];
    }
}


async function mostrarPreguntaAleatoria(){
    let listaPreguntas = JSON.parse(localStorage.getItem("preguntas"));  //modifique la mayus de preguntas
    let respondidas = parseInt(localStorage.getItem("preguntas_respondidas")) || 0;

    if(respondidas === 10){
        alert("Respondiste bien todas las preguntas. Ganaste en esta categoria");
        limpiarEfectosJuego();
        window.location.href = "indexRuleta.html";
        return;
    }

    if((!listaPreguntas) || (listaPreguntas.length === 0)) {
        alert("¡No quedan más preguntas en esta categoría! Elige otra.");
        limpiarEfectosJuego()
        // Limpiar el localstorage para una partida nueva
        window.location.href = "indexRuleta.html"
        return;

    }

    //Elegimos un índice al azar entre las preguntas que quedan disponibles
    const elementoContador = document.getElementById("contador-progreso");
    if(elementoContador){
        elementoContador.innerText = `Pregunta ${respondidas + 1} de 10`;
    }

    const indiceAleatorio = Math.floor(Math.random() * listaPreguntas.length);
    const preguntaActual =listaPreguntas[indiceAleatorio];

    //ELIMINAMOS la pregunta del vector para que no se repita
    listaPreguntas.splice(indiceAleatorio, 1);

    //GUARDAMOS el vector actualizado en el localStorage
    localStorage.setItem("preguntas", JSON.stringify(listaPreguntas));

    // texto de la pregunta en el html
    document.getElementById("pantalla-pregunta").innerText = preguntaActual.texto_pregunta;

    const opciones =await obtenerRespuestasPorPreguntas(preguntaActual.id);

    let botones = document.getElementsByClassName("option-btn")

    for (let i=0; i<botones.length; i++) {
        let boton = botones[i]
        if(botones[i] && opciones[i]){
            boton.textContent = opciones[i].texto_respuesta;
            boton.style.display = "block";
            boton.onclick = () => {
                responder(opciones[i].es_correcta);
            }
        }else{
            boton.style.display = "none";
        }
        
    }
}


function responder(esCorrecta) {
    if(esCorrecta === 1 || esCorrecta === true){
        alert("¡Correcto! Respondiste correctamente");
        let respondidas = parseInt(localStorage.getItem("preguntas_respondidas")) || 0;
        respondidas ++;
        localStorage.setItem("preguntas_respondidas", respondidas.toString());

        mostrarPreguntaAleatoria();
    }else{
        alert("Incorrecto. Intenta de nuevo.");
        limpiarEfectosJuego();
        window.location.href = "indexRuleta.html";
    }
}





function limpiarEfectosJuego() {
    localStorage.removeItem("preguntas");
    localStorage.removeItem("preguntas_respondidas");
    localStorage.removeItem("categoria_actual");
}
//Hacer la funcion responder
//Hacer la funcion limpiarElementos listo (ver si funciona)