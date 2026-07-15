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

app.post("/Usuarios", async function (req, res) {
    console.log(req.body)
    let respuesta = await realizarQuery(`
    SELECT * FROM Usuarios WHERE nombre="${req.body.nombre}" and mail = "${req.body.mail}" and contraseña="${req.body.contraseña}";
        `)
    if (respuesta.length > 0) {
        res.send({ message: "El usuario ya existe" })
    } else {
        let resultado= await realizarQuery(`INSERT INTO Usuarios(nombre, mail, contraseña,es_admin) VALUES ("${req.body.nombre}","${req.body.mail}","${req.body.contraseña}", 0);`)
        
        const nuevoId = resultado.insertId; // Obtener el ID del nuevo usuario insertado
        console.log("Nuevo usuario agregado con ID:", nuevoId);
        res.send({ ok: true,
                message: "Usuario Agregado", 
                id_usuario: nuevoId })
    }
})


// funcion inicio de sesion 

app.post("/UsuariosSesion", async function(req, res){
    try {
        console.log("Datos recibidos en sesión:", req.body);
        let respuesta = await realizarQuery(`
            SELECT * FROM Usuarios WHERE mail = "${req.body.mail}" AND contraseña = "${req.body.contraseña}";
        `);

        if (respuesta.length > 0) {
            // Usamos id_usuario en minúsculas porque viene de la tabla Usuarios
            const idDetectado = respuesta[0].id_usuario; 

            res.send({
                message: "Inicio de Sesion exitoso",
                es_admin: respuesta[0].es_admin,
                id_usuario: idDetectado
            });
        } else {
            res.send({
                message: "Usuario no existe"
            });
        }
    } catch (error) {
        console.error("Error en UsuariosSesion:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
});


// FUNCION DEL JUEGO 

app.get("/preguntasAleatorias", async function name(req, res) {
    try {
        if (req.query.categoria != undefined) {
            let resultado = await realizarQuery(`
            SELECT * FROM Preguntas WHERE categorias = "${req.query.categoria}";`);
            let categoria = req.query.categoria;
            res.send({ preguntas: resultado })
        } else {
            res.send({preguntas: [], ok : false})
        }
    } catch (error) {
        res.send({ message: error.message, preguntas: -1 })
    }
})

// FUNCION PARA TRAER LOS DATOS DE LAS RESPUETAS COMBINADOS CON EL USER:
 


app.get("/partida", async function (req, res) {
    try {
        const resultado = await realizarQuery(`
            SELECT 
                p.id_partida, 
                u.nombre, 
                p.preguntas_totales, 
                p.aciertos, 
                p.puntaje_maximo 
            FROM Partida p 
            INNER JOIN Usuarios u ON p.ID_usuario = u.id_usuario -- p usa MAYÚSCULAS, u usa minúsculas
            ORDER BY p.puntaje_maximo DESC;
        `);
        res.send(resultado);
    } catch (error) {
        console.error("Error al obtener la tabla de puntos:", error);
        res.status(500).send({ message: error.message, error: true });
    }
});

// 1. Sumar 1 punto por respuesta correcta

app.post("/sumarPunto", async function (req, res) {
    try {
        const { id_usuario } = req.body; // Este viene del front en minúsculas, está bien.
        
        // Buscamos usando ID_usuario (mayúsculas) porque es la tabla Partida
        let partida = await realizarQuery(`SELECT id_partida FROM Partida WHERE ID_usuario = ${id_usuario} LIMIT 1;`);

        if (partida.length > 0) {
            await realizarQuery(`
                UPDATE Partida 
                SET aciertos = aciertos + 1, puntaje_maximo = puntaje_maximo + 1, preguntas_totales = preguntas_totales + 1
                WHERE ID_usuario = ${id_usuario};
            `);
        } else {
            await realizarQuery(`
                INSERT INTO Partida (puntaje_maximo, preguntas_totales, aciertos, ID_usuario) 
                VALUES (1, 1, 1, ${id_usuario});
            `);
        }
        res.send({ ok: true, message: "+1 punto sumado" });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 2. Sumar Bonus de Categoría
app.post("/sumarBonusCategoria", async function (req, res) {
    try {
        const { id_usuario } = req.body;
        
        await realizarQuery(`
            UPDATE Partida 
            SET puntaje_maximo = puntaje_maximo + 10 
            WHERE ID_usuario = ${id_usuario};
        `);
        res.send({ ok: true, message: "+10 puntos de bonus aplicados" });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// Reiniciar la puntuacion si se desea
app.post("/reiniciarPuntuacionBD", async function (req, res) {
    try {
        const { id_usuario } = req.body;
        
        // Ejecutamos el DELETE usando ID_usuario con mayúsculas (como está en tu tabla Partida)
        await realizarQuery(`DELETE FROM Partida WHERE ID_usuario = ${id_usuario};`);
        
        res.send({ ok: true, message: "Puntuación eliminada de la base de datos correctamente" });
    } catch (error) {
        console.error("Error en reiniciarPuntuacionBD:", error);
        res.status(500).send({ ok: false, message: error.message });
    }
});

// FUNCION ADMIN

app.get('/preguntas', async function (req, res) {
    let respuesta;
    if (req.query.id_preguntas != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Preguntas WHERE id_preguntas=${req.query.id_preguntas}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Preguntas");
    }
    res.send(respuesta);
})


app.post('/preguntas', async function (req, res) {
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
        INSERT INTO Preguntas (categorias,texto_pregunta) VALUES
        ("${req.body.categorias}","${req.body.texto_pregunta}")
    `)
        res.send({ message: "Pregunta agregado" });
    }
})

app.put('/preguntas', function (req, res) {
    console.log(req.body)
    realizarQuery(`
        UPDATE Preguntas SET categorias = "${req.body.categorias}", texto_pregunta = "${req.body.texto_pregunta}"
        WHERE id=${req.body.id_preguntas}
     `)
    res.send({ message: "Pregunta modificada" })

})


app.delete('/preguntas', function (req, res) {
    try {
        console.log(req.body)
        realizarQuery(`
            DELETE FROM Preguntas WHERE id_preguntas = "${req.body.id}"
         `)
        res.send({ message: "pregunta eliminada" })
    } catch (error) {
        res.send({ message: error.message, preguntas: -1 })
    }

})

app.get("/respuestas", async function (req, res) {
    let respuesta = [];
    console.log(req.query)
    if (req.query.id_preguntas != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Respuestas WHERE id_preguntas=${req.query.id_preguntas}`)
    } 
    res.send(respuesta);
})



app.get('/respuestaTabla', async function (req, res) {
    let respuesta;
    if (req.query.id_respuestas != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Respuestas WHERE id_respuestas=${req.query.id_respuestas}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Respuestas");
    }
    res.send(respuesta);
})

app.post('/respuestasAgregadas', async function (req, res) {
    try {
        console.log(req.body); 
        await realizarQuery(`
            INSERT INTO Respuestas (id_preguntas, texto_respuesta, es_correcta)
            VALUES
            (
                "${req.body.id_preguntas}",
                "${req.body.texto_respuesta}",
                "${req.body.es_correcta}"
            )
        `);
        res.send({ message: "Respuesta agregada" });
    } catch (error) {
        res.send({ message: error.message });
    }
});


app.put("/respuestasModificadas", async function (req, res) {
    try {
        console.log(req.body);
        await realizarQuery(`
            UPDATE Respuestas SET texto_respuesta = "${req.body.texto_respuesta}", es_correcta = "${req.body.es_correcta}"
            WHERE id_respuestas = ${req.body.id_respuestas}
        `);

        res.send({ message: "Respuesta modificada correctamente" });

    } catch (error) {
        res.send({ message: error.message });
    }
});

