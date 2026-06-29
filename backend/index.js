var express = require('express'); 
var bodyParser = require('body-parser'); 
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); 
var port = process.env.PORT || 4000; 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});



app.get('/Usuarios', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE id_usuario=${req.query.id_usuario}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Usuarios");
    }
    res.send(respuesta);
})

// funcion registro

app.post("/Usuarios", async function(req,res){
    console.log(req.body)
    let respuesta = await realizarQuery(`
    SELECT * FROM Usuarios WHERE nombre="${req.body.nombre}" and mail = "${req.body.mail}" and contraseña="${req.body.contraseña}";
        `)
        if (respuesta.length > 0){
            res.send({message:"El usuario ya existe"})
        } else {
            realizarQuery(`INSERT INTO Usuarios(nombre, mail, contraseña) VALUES
             ("${req.body.nombre}","${req.body.mail}","${req.body.contraseña}")`)
            res.send({message:"Usuario Agregado"})
            }
})

// funcion inicio de sesion 

app.post("/UsuariosSesion", async function(req,res){
    console.log(req.body)
    let respuesta = await realizarQuery(`
    SELECT * FROM Usuarios WHERE  mail = "${req.body.mail}" and contraseña="${req.body.contraseña}";
        `)
        if (respuesta.length > 0){
            res.send({message:"Inicio de Sesion exitoso"})
        } else {
            res.send({message:"Usuario no existe"})
            }
})



/*
app.get("/preguntas", async function name(req, res) {
    try {
        let res = await realizarQuery("");
    
        res.send({preguntas: res[0]})
    } catch (error) {
        res.send({message: error.message, preguntas: -1})
    }
})


//FUNCIONES DE ADMIN

app.get('/Preguntas', async function(req,res){
    let respuesta;
    if (req.query.id_preguntas != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Preguntas WHERE id_preguntas=${req.query.id_preguntas}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Preguntas");
    }    
    res.send(respuesta);
})


app.post('/Preguntas', async function(req,res) {
 console.log(req.body) //Los pedidos post reciben los datos del req.body
 let existe = []   
 if (req.body.id_preguntas != undefined) {
         existe = await realizarQuery(`
            SELECT id_preguntas =${req.body.id_preguntas} FROM Preguntas 
        `)
        
    }

    if (existe.length > 0) {
        res.send({ message: "Pregunta ya existe" })

    } else {
        await realizarQuery(`
        INSERT INTO Pregunta (categorias,texto_pregunta) VALUES
        ("${req.body.categorias}","${req.body.texto_pregunta}")
    `)
    res.send({ message: "Pregunta agregado" });
    }
})

app.put('/Preguntas',function(req, res){
    console.log(req.body)
    realizarQuery(`
        UPDATE Preguntas SET categorias = "${req.body.categorias}", texto_pregunta = "${req.body.texto_pregunta}"
        WHERE id=${req.body.id_preguntas}
     `)
    res.send({ message: "Pregunta modificada" })

})



app.delete('/Preguntas', function(req, res){
    console.log(req.body)
    realizarQuery(`
        DELETE FROM Preguntas WHERE id_preguntas = "${req.body.id_preguntas}"
     `)
    res.send({message:"pregunta eliminado"})

} )

*/







