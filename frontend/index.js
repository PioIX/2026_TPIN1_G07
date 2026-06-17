async function llamadoAlGet() {
    //El get no manda body, si quiero mandar parametros lo sumo a la url con el ?
    const response = await fetch('http://localhost:4000/usuarios', {
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


async function cargarTabla() {
    let result = await fetch('http://localhost:4000/cursos')
   let vectorDeDatos= await result.json()
    let elementosLista =""
    for(let i = 0; i< vectorDeDatos.length; i++){
        const element = vectorDeDatos[i];
        elementosLista += `
                <tr>
                <td>${element.nombre}</td>
                <td>${element.aula}</td>
                <td>${element.profesor}</td>
                </tr>
                `;

    }
    document.getElementById('tabla-contenido').innerHTML = elementosLista
}


//Los datos en el post se mandan dentro de un objeto 
async function llamadoAlPost(datos) {
    const response = await fetch('http://localhost:4000/cursos', {
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
        aula: getAula(),
        profesor: getProfesor(),
    }
    llamadoAlPost(datos)
}

const selector = document.getElementById('selector-datos');
async function cargarSelect() {
try {
        let result = await fetch('http://localhost:4000/cursos') 
        let resultado = await result.json()
        selector.innerHTML = '<option value="">Seleccione un destino...</option>';
        for (let i = 0; i < resultado.length; i++) {
            const element = resultado[i];
                selector.innerHTML += `<option value="${element.id}">${element.aula}</option>`;
               
            };
    } catch (error) {
    console.log("Error al cargar los datos:", error);
}} 
cargarSelect();

