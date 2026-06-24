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