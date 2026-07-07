
async function llamadoAlGet() {
    //El get no manda body, si quiero mandar parametros lo sumo a la url con el ?
    const response = await fetch('http://localhost:4000/Usuarios', {
        method: "GET", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log(response)
    //Desarma el json y lo arma como un objeto
    let result = await response.json()
    console.log(result)
}



//Los datos en el post se mandan dentro de un objeto 
async function llamadoAlPost(datos) {
    const response = await fetch('http://localhost:4000/Usuarios', {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) //JSON.stringify convierte de objeto a JSON
    })

    console.log(response)
    //Desarma el json y lo arma como un objeto
    let result = await response.json()
    console.log(result)


    if (result.message === "Usuario Agregado") {
        alert("Registro exitoso");
        window.location.href = "indexRuleta.html"; 
    } else {
        alert(result.message);
    }
    

}

function tomarDatos() {
    //Los parametros del objeto se tienen que llamar como los espera el BACKEND
    let datos = {
        nombre: getNombre(),
        mail: getMail(),
        contraseña: getContraseña(),
    }

    if (datos.nombre === "" || datos.mail === "" || datos.contraseña === "") {
        alert("Se necesita completar todos los campos");
        return;
    }
    else{
        llamadoAlPost(datos)

    }
}

async function Sesion(datosS) {
    const response = await fetch('http://localhost:4000/UsuariosSesion', {
        method: "POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosS) //JSON.stringify convierte de objeto a JSON
    })

    console.log(response)
    //Desarma el json y lo arma como un objeto
    let result = await response.json()
    console.log(result)

    if (result.message === "Inicio de Sesion exitoso") {
        alert("Bienvenido");

        if (result.es_admin) {
            // Si es administrador
            window.location.href = "Admin.html";
        } else {
            // Si es usuario común
            window.location.href = "indexRuleta.html";
        }

    } else {
        alert("Correo o contraseña incorrectos");
    }
    
}

function tomarDatosSesion() {
    //Los parametros del objeto se tienen que llamar como los espera el BACKEND
    let datosS = {
        mail: getMailS(),
        contraseña: getContraseñaS(),
    }
    
    if (datosS.mail === "" || datosS.contraseña === "") {
        alert("Se necesita completar todos los campos");
        return;
    }
    else{
        Sesion(datosS)
    }

}


//llenar las tablas:
function Iniciar() {
    llenarTabla();
    llenarTablaPre();
}



async function llenarTabla() {

        let result = await fetch('http://localhost:4000/preguntas') 
    let vectorDeDatos = await result.json()
    let elementosLista = ""
    for (let i = 0; i < vectorDeDatos.length; i++) {
        const element = vectorDeDatos[i];
        elementosLista += `
                <tr>
                <td>${element.texto_pregunta}</td>
                <td>${element.categorias}</td>
                <td>${element.id_preguntas}</td>                
                </tr>
                `;
                
    }
    document.getElementById('tabla-contenido').innerHTML = elementosLista
}
 

async function llenarTablaPre() {

        let result = await fetch('http://localhost:4000/respuestaTabla') 
    let vectorDeDatos = await result.json()
    let elementosLista = ""
    for (let i = 0; i < vectorDeDatos.length; i++) {
        const element = vectorDeDatos[i];
        elementosLista += `
                <tr>
                <td>${element.id_respuestas}</td>  
                <td>${element.texto_respuesta}</td>
                <td>${element.es_correcta}</td>
                <td>${element.id_preguntas}</td>                
                </tr>
                `;
                
    }
    document.getElementById('tabla-contenido-Preguntas').innerHTML = elementosLista
}


async function GetPreguntas() {
    //El get no manda body, si quiero mandar parametros lo sumo a la url con el ?
    const response = await fetch('http://localhost:4000/preguntas',{
        method:"GET", //GET, POST, PUT oz DELETE
        headers: {
        "Content-Type": "application/json",
        },
    })

    console.log(response)
    //Desarma el json y lo arma como un objeto
    let result = await response.json()
    console.log(result)
}


//Los datos en el post se mandan dentro de un objeto 
async function PostPreguntas(datos) {
    const response = await fetch('http://localhost:4000/preguntas',{
        method:"POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) //JSON.stringify convierte de objeto a JSON
    })

    console.log(response)
    //Desarma el json y lo arma como un objeto
    let result = await response.json()
    console.log(result)
}

function DatosPregunta() {
    let datos = {
        categorias: ingresoCategorias(),
        texto_pregunta: ingresoTextoPregunta(),
    }
    PostPreguntas(datos)
}

const selector = document.getElementById('selector-datos');
const selector2 = document.getElementById('selector-datos2');
async function cargarSelect() {
try {
        let result = await fetch('http://localhost:4000/preguntas') 
        let resultado = await result.json()
        selector.innerHTML = '<option value="">Seleccione una pregunta...</option>';
        selector2.innerHTML = '<option value="">Seleccione un pregunta...</option>';
        for (let i = 0; i < resultado.length; i++) {
            const element = resultado[i];
                selector.innerHTML += `<option value="${element.id_preguntas}">${element.texto_pregunta}</option>`;
                selector2.innerHTML += `<option value="${element.id_preguntas}">${element.texto_pregunta}</option>`;
               
            };
    } catch (error) {
    console.log("Error al cargar los datos:", error);
}} 
cargarSelect();

async function borrarDatos() {
    let datos = {
        id:document.getElementById("selector-datos").value,
    }
    console.log(datos)
        const response = await fetch('http://localhost:4000/Preguntas',{
        method:"DELETE", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) 
    })

    console.log(response)
    let result = await response.json()
    console.log(result)
    llenarTabla() //Fijarse si actualiza los selects
}

async function cambiarDato() {
    let datos = {
        categorias: document.getElementById("botonInputCategorias").value,
        texto_pregunta:document.getElementById("botonInputTextoregunta").value,
        id_preguntas: document.getElementById("selector-datos").value,

    }
try {
        const response = await fetch('http://localhost:4000/Preguntas',{
        method:"PUT", //GET, POST, PUT o DELETE
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(datos) 
        })
    
        console.log(response)
        let result = await response.json()
        console.log(result)
} catch (error) {
    console.error("Error de red o conexión:", error);
}
    
}



async function PostRespuestas(datos) {

    const response = await fetch('http://localhost:4000/respuestasAgregadas', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    });

    console.log(response);

    let result = await response.json();
    console.log(result);

}


async function cargarPreguntasRespuestas() {

    try {

        let result = await fetch('http://localhost:4000/preguntas');
        let preguntas = await result.json();

        let selectorPregunta = document.getElementById("selectorPregunta");

        selectorPregunta.innerHTML = '<option value="">Seleccione una pregunta</option>';

        for (let i = 0; i < preguntas.length; i++) {

            selectorPregunta.innerHTML += `
                <option value="${preguntas[i].id_preguntas}">
                    ${preguntas[i].texto_pregunta}
                </option>
            `;

        }

    } catch (error) {

        console.log(error);

    }

}

function Iniciar() {
    llenarTabla();
    llenarTablaPre();
    cargarPreguntasRespuestas();
}


async function DatosRespuestas() {

    let correcta = getRespuestaCorrecta();

    let respuestas = [

        {
            id_preguntas: getPreguntaSeleccionada(),
            texto_respuesta: ingresoRespuesta1(),
            es_correcta: correcta == 1 ? 1 : 0
        },

        {
            id_preguntas: getPreguntaSeleccionada(),
            texto_respuesta: ingresoRespuesta2(),
            es_correcta: correcta == 2 ? 1 : 0
        },

        {
            id_preguntas: getPreguntaSeleccionada(),
            texto_respuesta: ingresoRespuesta3(),
            es_correcta: correcta == 3 ? 1 : 0
        },

        {
            id_preguntas: getPreguntaSeleccionada(),
            texto_respuesta: ingresoRespuesta4(),
            es_correcta: correcta == 4 ? 1 : 0
        }

    ];

    for (let i = 0; i < respuestas.length; i++) {

        await PostRespuestas(respuestas[i]);

    }

    alert("Respuestas agregadas correctamente");

}


async function PutRespuesta(datos) {

    const response = await fetch("http://localhost:4000/respuestasModificadas", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    });

    console.log(response);

    let result = await response.json();
    console.log(result);

    alert(result.message);

}


function DatosModificarRespuesta() {

    let datos = {

        id_respuestas: getIdRespuestaModificar(),
        texto_respuesta: getTextoRespuestaModificar(),
        es_correcta: getEsCorrectaModificar()

    };

    PutRespuesta(datos);

}


async function cargarSelectorRespuestas() {

    try {

        let result = await fetch("http://localhost:4000/respuestaTabla");
        let respuestas = await result.json();

        let selector = document.getElementById("selectorRespuesta");

        selector.innerHTML = '<option value="">Seleccione una respuesta</option>';

        for (let i = 0; i < respuestas.length; i++) {

            selector.innerHTML += `
                <option value="${respuestas[i].id_respuestas}">
                    ${respuestas[i].texto_respuesta}
                </option>
            `;

        }

    } catch (error) {

        console.log(error);

    }

}

function Iniciar() {
    llenarTabla();
    llenarTablaPre();
    cargarPreguntasRespuestas();
    cargarSelectorRespuestas();
}