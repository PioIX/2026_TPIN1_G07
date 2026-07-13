function traerPreguntas(categoria) {
    iniciarJuegoPorCategoria(categoria)
}


async function iniciarJuegoPorCategoria(categoria) {
    try{
        
        const respuesta =await fetch('http://localhost:4000/preguntasAleatorias?categoria=' + categoria);
        const datos = await respuesta.json();

        const vectorPreguntas = datos.preguntas;
        console.log(vectorPreguntas)
    //'datos.preguntas' trae el vector de preguntas de MySQL
    //localStorage.setItem("preguntas", vector)
   
        localStorage.setItem("preguntas",JSON.stringify(vectorPreguntas));
        localStorage.setItem("categoria_actual", categoria);  // guardamos la categoria actual
        // contador de preguntas en 0
        
        
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


// Función auxiliar para avisarle al backend que sume 1 punto
async function notificarPuntoEnBD() {
    let idUsuario = localStorage.getItem("ID_usuario");
    if (!idUsuario) return;

    try {
        await fetch('http://localhost:4000/sumarPunto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: parseInt(idUsuario) })
        });
    } catch (error) {
        console.error("Error al sumar punto en la BD:", error);
    }
}

// Función auxiliar para avisarle al backend que sume los 10 puntos de bonus
async function notificarBonusEnBD() {
    let idUsuario = localStorage.getItem("ID_usuario");
    if (!idUsuario) return;

    try {
        await fetch('http://localhost:4000/sumarBonusCategoria', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: parseInt(idUsuario) })
        });
    } catch (error) {
        console.error("Error al sumar bonus en la BD:", error);
    }
}

function actualizarPuntajeEnPantalla() {
    const marcador = document.getElementById("contador-puntos");
    if (marcador) {
        // Leemos cuántas preguntas respondidas bien lleva en esta categoría
        let puntosActuales = localStorage.getItem("preguntas_respondidas") || "0";
        marcador.innerText = puntosActuales;
    }
}

async function mostrarPreguntaAleatoria(){
    let listaPreguntas = JSON.parse(localStorage.getItem("preguntas"));  
    let respondidas = parseInt(localStorage.getItem("preguntas_respondidas")) || 0;

    actualizarPuntajeEnPantalla();

    if(respondidas == 10){
        alert("¡Respondiste bien todas las preguntas! Ganaste en esta categoría y te llevas +10 puntos extra.");
        
        //Sumamos los 10 puntos en MySQL
        await notificarBonusEnBD();

        let categoriasTerminadas = JSON.parse(localStorage.getItem("categoriasTerminadas")) || [];
        categoriasTerminadas.push(localStorage.getItem("categoria_actual"));
        localStorage.setItem("categoriasTerminadas", JSON.stringify(categoriasTerminadas));
        
        limpiarEfectosJuego();
        window.location.href = "indexRuleta.html";
        return;
    }

    if((!listaPreguntas) || (listaPreguntas.length === 0)) {
        alert("¡No quedan más preguntas en esta categoría! Elige otra.");
        limpiarEfectosJuego();
        window.location.href = "indexRuleta.html";
        return;
    }

    const elementoContador = document.getElementById("contador-progreso");
    if(elementoContador){
        elementoContador.innerText = `Pregunta ${respondidas + 1} de 10`;
    }

    const indiceAleatorio = Math.floor(Math.random() * listaPreguntas.length);
    const preguntaActual = listaPreguntas[indiceAleatorio];

    listaPreguntas.splice(indiceAleatorio, 1);
    localStorage.setItem("preguntas", JSON.stringify(listaPreguntas));

    document.getElementById("pantalla-pregunta").innerText = preguntaActual.texto_pregunta;

    const opciones = await obtenerRespuestasPorPreguntas(preguntaActual.id_preguntas);
    let botones = document.getElementsByClassName("option-btn");

    for (let i=0; i<botones.length; i++) {
        let boton = botones[i];
        if(opciones[i]){
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




async function responder(esCorrecta) {
    let respondidas = parseInt(localStorage.getItem("preguntas_respondidas")) || 0;
    let categoria_actual = localStorage.getItem("categoria_actual");
    
    if(esCorrecta === 1 || esCorrecta === true){
        alert("¡Correcto! Respondiste correctamente");
        
        // LLAMADA AL PUNTO INDIVIDUAL: Suma 1 punto inmediatamente en MySQL
        await notificarPuntoEnBD();

        respondidas++;
        localStorage.setItem("preguntas_respondidas", respondidas.toString());
        actualizarPuntajeEnPantalla();

        mostrarPreguntaAleatoria();
    } else {
        alert("Incorrecto. Fin del juego para esta categoría.");

        // Como se equivoca, la categoría simplemente se bloquea en el localStorage
        // No llamamos a la base de datos acá porque sus puntos ya se fueron sumando uno a uno
        let categoriasBloqueadas = JSON.parse(localStorage.getItem("categoriasBloqueadas")) || [];
        if(!categoriasBloqueadas.includes(categoria_actual)) {
            categoriasBloqueadas.push(categoria_actual);
            localStorage.setItem("categoriasBloqueadas", JSON.stringify(categoriasBloqueadas));
        }

        let volver = confirm("¿Queres volver a la ruleta para jugar otra categoria?\n(Si cancelas, irás a la tabla de puntuación)");
        limpiarEfectosJuego();

        if(volver){
            window.location.href = "indexRuleta.html";
        }else{
            window.location.href = "puntos.html";
        }
    }
}


function limpiarEfectosJuego() {
    localStorage.removeItem("preguntas");
    localStorage.removeItem("preguntas_respondidas");
    localStorage.removeItem("categoria_actual");
}

// Funcion para cuando completa el juego, ver si cuando tira la ruleta de nuevo la categoria ya fue completada y no se pueda volver a jugar

function verificarCategoriaTerminada(categoriaGanadora){
    let categoriasTerminadas = JSON.parse(localStorage.getItem("categoriasTerminadas")) || [];  
    return categoriasTerminadas.includes(categoriaGanadora);
}



