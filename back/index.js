"use strict";
/*IIMPORTS
-express para la app
-firestore y rtdb:
Una ves importado firestore desde db
Estamos habilitados para interactuar con la base de datos
-cors para como middleware
-nanoid para generar valores random
*/
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
require("dotenv/config");
var cors = require("cors");
//
var port = process.env.PORT || 3000;
var app = express();
//Middleware
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
//REFERENCIAS A LAS COLECCIONES
var userCollection = db_1.firestore.collection("users");
var roomsCollection = db_1.firestore.collection("/rooms");
////SIGNUP//////////
/*
Crea un nuevo usuario e informa si se ingresa un email que ya existe
*/
app.post("/signup", function (req, res) {
    //Se pasa un email y nombre por el body
    var email = req.body.email;
    var nombre = req.body.nombre;
    /*
    se revisa en base de datos si existe un users con mail y id pasado.
    para eso se usa la funcion where.
    Busca los docs que cumplan con las condiciones enviadas por parametros.
    1er parametro, campo---2do parametro la condicion
    el metodo se ejecuta con un get que devuelve una promesa
    */
    userCollection //refe de la coleeccion users
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        //preguntamos si la respuesta llega vacia (es decir el email ingresado no existe)
        if (searchResponse.empty) {
            /*
            de estar vacia agregamos un nuevo objeto a la collection (add)
            Responde con una promesa (then) que devuelve la referencia al objeto creado-
            de newUserRef va a tomar el id para devolverlo en la res.
            Este id va a ser la llave para posteriormente decirle quien somos
            */
            userCollection //refe a la collection users
                .add({
                email: email,
                nombre: nombre,
            })
                .then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    new: true,
                    //agregamos el true para diferenciar cuando nos responde con un usuario nuevo y cuando con uno existente
                });
            });
        }
        else {
            res.status(400).json({
                message: "user already exists",
            });
        }
    });
});
//AUTH
//Metodo para autenticarse.
app.post("/auth", function (req, res) {
    //se le pasa por el body un email
    var email = req.body.email; //es lo mismo que const email = req.body.email
    //Tomamos de referencia el signup pero
    //en caso de estar vacio el mail es que no se ha logueado
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        //preguntamos si la respuesta llega vacia (es decir el email ingresado no existe)
        //devolvemos error
        if (searchResponse.empty) {
            res.status(400).json({
                message: "not found",
            });
        }
        else {
            //de existir devolvemos el id
            //si no esta vacio respondemos con el id del doc
            //como searchResponse es un array voy al primero. Se que no hay otros con ese email
            //id: searchResponse.docs[0].id,
            // });
            res.json({
                id: searchResponse.docs[0].id,
            });
        }
    });
});
///CREACION DE UN ROOM
//Para crear al mismo tenemos que tener previamente un mail logueado con su id
app.post("/rooms", function (req, res) {
    //Tomamos del body el userId
    var userId = req.body.userId;
    //Buscamos en la userscollection si existe ese Id de usuario
    //de existir lo buscamos y creamos una nueva ref en la rtdb
    userCollection
        .doc(userId.toString()) //lo pasamos a string por las dudas
        .get() //vamos a buscarlo
        .then(function (doc) {
        //nos devuelve en una promesa una referencia de ese doc
        //si este existe
        if (doc.exists) {
            //creamos una referencia en la rtdb con un id largo generado por nanoid
            var refroomrtdb_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)(12));
            //le seteamos contenido. Objeto con dos propiedades:
            //array de mensajes vacio y owner que contiene el id de usuario q le pasamos
            refroomrtdb_1
                .set({
                messages: [],
                owner: userId, //id de usuario
            }) //devuelve una promesa
                .then(function () {
                //generamos dos nuevas constantes:
                //idRoom donde guardamos el id de la referencia
                //newIdRoom es un id corto y sencillo de recordar generado con un random
                var idRoom = refroomrtdb_1.key; //es igual al random de nanoid
                var newIdRoom = 1000 + Math.floor(Math.random() * 999);
                //Vamos a la referencia de la rooms collection en firebase
                //creamos un doc en las room con el id random facil de recordar
                //le seteamos un objeto con la propiedad rtdbRoomUd con el id de la rtdb
                roomsCollection
                    .doc(newIdRoom.toString())
                    .set({
                    rtdbRoomId: idRoom, //id de la ref en la rtdb
                })
                    .then(function () {
                    //devuelve el id random sencillo de recordar.
                    //Este servira para acceder a este room en otro momento
                    res.json({
                        id: newIdRoom.toString(), //creado, corto facil de recordar
                    });
                });
            });
        }
        else {
            //sino existe el usuario porque le ingresamos un id incorrecto devuelve error
            res.status(401).json({
                message: "No Existis",
            });
        }
    });
});
//Metodo para pedir el id complejo si tenemos el corto para acceder a un room existente
//El metodo get no esta preparado para leer el body asi que va leer desde params
//Estos se reciben desde el objeto query y params
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    userCollection
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomsCollection
                .doc(roomId)
                .get()
                .then(function (snap) {
                var data = snap.data(); //devuelve el objeto completo
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "No Existis",
            });
        }
    });
});
////////// probando para subir msjs
app.post("/messages", function (req, res) {
    var roomId = req.body.roomId;
    var message = req.body.message;
    var fullName = req.body.fullName;
    roomsCollection
        .doc(roomId)
        .get()
        .then(function (snap) {
        var rtdbId = snap.data();
        console.log(rtdbId.rtdbRoomId);
        var chatroomRef = db_1.rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/messages");
        chatroomRef.push({
            message: message,
            fullName: fullName,
        }, function () {
            return res.json("todo ok");
        });
    });
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
//
app.listen(port, function () {
    console.log("Servidor inicializado en http://localhost:".concat(port));
});
