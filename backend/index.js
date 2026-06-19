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

// tabla Cursos

app.get('/Usuarios', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE id_usuario=${req.query.id_usuario}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Usuarios");
    }
    res.send(respuesta);
})


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



app.post("/UsuariosSesion", async function(req,res){
    console.log(req.body)
    let respuesta = await realizarQuery(`
    SELECT * FROM Usuarios WHERE  mail = "${req.body.mail}" and contraseña="${req.body.contraseña}";
        `)
        if (respuesta.length > 0){
            res.send({message:"Inicio de Secion exitoso"})
        } else {
            res.send({message:"Usuario no existe"})
            }
})






