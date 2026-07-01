
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
        window.location.href = "indexRuleta.html"; // Cambia por el nombre de tu página del juego
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




//ACA EMPIEZA FUCION ADMIN
/*
async function llenarTabla() {
        let result = await fetch('http://localhost:4000/Preguntas') 
    let vectorDeDatos = await result.json()
    let elementosLista = ""
    for (let i = 0; i < vectorDeDatos.length; i++) {
        const element = vectorDeDatos[i];
        elementosLista += `
                <tr>
                <td>${element.texto_pregunta}</td>
                <td>${element.categorias}</td>
                </tr>
                `;
                
    }
    document.getElementById('tabla-contenido').innerHTML = elementosLista
}
        
async function llamadoAlGet() {
    //El get no manda body, si quiero mandar parametros lo sumo a la url con el ?
    const response = await fetch('http://localhost:4000/Preguntas',{
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
async function envioPost(datos) {
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

function tomarDatos() {
    let datos = {
        categorias: ingresoCategorias(),
        texto_pregunta: ingresoTextoPregunta(),
    }
    envioPost(datos)
}

const selector = document.getElementById('selector-datos');
const selector2 = document.getElementById('selector-datos2');
async function cargarSelect() {
try {
        let result = await fetch('http://localhost:4000/Preguntas') 
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
/*


