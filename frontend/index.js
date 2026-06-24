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
}

function tomarDatos() {
    //Los parametros del objeto se tienen que llamar como los espera el BACKEND
    let datos = {
        nombre: getNombre(),
        mail: getMail(),
        contraseña: getContraseña(),
    }
    llamadoAlPost(datos)
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
    
}

function tomarDatosSesion() {
    //Los parametros del objeto se tienen que llamar como los espera el BACKEND
    let datosS = {
        mail: getMailS(),
        contraseña: getContraseñaS(),
    }
    Sesion(datosS)
}

//ACA EMPIEZA FUCION ADMIN

async function llenarTabla() {
        let result = await fetch('http://localhost:4000/cursos') 
    let vectorDeDatos = await result.json()
    let elementosLista = ""
    for (let i = 0; i < vectorDeDatos.length; i++) {
        const element = vectorDeDatos[i];
        elementosLista += `
                <tr>
                <td>${element.nombre}</td>
                <td>${element.profesor}</td>
                <td>${element.aula}</td>
                </tr>
                `;
                
    }
    document.getElementById('tabla-contenido').innerHTML = elementosLista
}
        
async function llamadoAlGet() {
    //El get no manda body, si quiero mandar parametros lo sumo a la url con el ?
    const response = await fetch('http://localhost:4000/cursos',{
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
    const response = await fetch('http://localhost:4000/cursos',{
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
        nombre: ingresoNombre(),
        profesor: ingresoProfesor(),
        aula: ingresoAula(),
    }
    envioPost(datos)
}

const selector = document.getElementById('selector-datos');
const selector2 = document.getElementById('selector-datos2');
async function cargarSelect() {
try {
        let result = await fetch('http://localhost:4000/cursos') 
        let resultado = await result.json()
        selector.innerHTML = '<option value="">Seleccione un curso...</option>';
        selector2.innerHTML = '<option value="">Seleccione un curso...</option>';
        for (let i = 0; i < resultado.length; i++) {
            const element = resultado[i];
                selector.innerHTML += `<option value="${element.id}">${element.nombre}</option>`;
                selector2.innerHTML += `<option value="${element.id}">${element.nombre}</option>`;
               
            };
    } catch (error) {
    console.log("Error al cargar los datos:", error);
}} 
cargarSelect();

async function borrarDatos() {
    let datos = {
        id:document.getElementById("selector-datos").value,
    }
        const response = await fetch('http://localhost:4000/cursos',{
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
        nombre: document.getElementById("botonInputNombre").value,
        profesor:document.getElementById("botonInputProfesor").value,
        aula: document.getElementById("botonInputAula").value,
        id: document.getElementById("selector-datos").value,

    }
try {
        const response = await fetch('http://localhost:4000/cursos',{
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
