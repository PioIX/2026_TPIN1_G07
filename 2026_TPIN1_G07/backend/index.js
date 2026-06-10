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

// tabla Usuarios

app.get('/usuarios', async function (req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE id=${req.query.id}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Usuarios");
    }
    res.send(respuesta);
})


app.post("/cursos", async function(req,res){
    console.log(req.body)
    let respuesta = await realizarQuery(`
    SELECT * FROM Cursos WHERE nombre="${req.body.nombre}" and profesor = "${req.body.profesor}" and aula="${req.body.aula}";
        `)
        if (respuesta.length > 0){
            res.send({message:"El curso ya existe"})
        } else {
            realizarQuery(`INSERT INTO Cursos(nombre, profesor, aula) VALUES
             ("${req.body.nombre}","${req.body.profesor}","${req.body.aula}")`)
            res.send({message:"Curso Agregado"})
            }
})





app.put("/cursos", async function(req,res){
    console.log(req.body)
    await realizarQuery(`
    UPDATE Cursos SET nombre="${req.body.nombre}"
    WHERE id= ${req.body.id};`
    )
    res.send("Curso Actualizado")
})

app.delete('/cursos', function (req, res) {
    console.log(req.body)
    realizarQuery(` DELETE FROM Cursos WHERE id=${req.body.id};`
    )
    res.send("Curso eliminado")
})


