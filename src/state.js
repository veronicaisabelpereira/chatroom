"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
var db_1 = require("./db");
//para tratar un objeto de objetos como un array
var lodash_1 = require("lodash");
var API_BASE_URL = "http://localhost:3000";
//
var state = {
    data: {
        fullName: "",
        userId: "",
        roomId: "",
        email: "",
        messages: [],
        rtdbRoomId: "", //id complejo
    },
    listeners: [],
    init: function () {
        var lastStorageState = localStorage.getItem("state");
    },
    //usa el rtdbRoomId
    listenRoom: function () {
        var _this = this;
        var cs = this.getState();
        //Referencia al lugar de la base de datos
        var chatroomRef = db_1.rtdb.ref("/rooms/" + cs.rtdbRoomId);
        //Escuchamos cambios
        chatroomRef.on("value", function (snapshot) {
            //optener ultima version del estado cada vez que cambia
            var currentState = _this.getState();
            var messageFromServer = snapshot.val();
            console.log(messageFromServer);
            var messagesList = (0, lodash_1.map)(messageFromServer.messages);
            currentState.messages = messagesList;
            _this.setState(currentState);
        });
    },
    //METODOS ESPECIFICOS
    //Setear valores a las propiedades de data:
    //email y fullName
    //roomId
    //messages
    setEmailAndFullname: function (email, fullName) {
        var cs = this.getState();
        cs.email = email;
        cs.fullName = fullName;
        this.setState(cs);
    },
    setRoomId: function (roomId) {
        var cs = this.getState();
        cs.roomId = roomId;
        this.setState(cs);
    },
    setMessage: function (message) {
        var cs = this.getState();
        cs.messages.push({ message: message, fullName: cs.fullName });
    },
    //METODO PARA AUTENTICARSE
    signIn: function (callback) {
        var _this = this;
        var cs = this.getState();
        //Preguntamos si el cs tiene un email,
        //de tener va a ir al endpoint auth de la api mediante fetch
        if (cs.email) {
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: cs.email,
                }),
            })
                .then(function (res) {
                return res.json();
            })
                .then(function (data) {
                cs.userId = data.id;
                console.log("Cambio el state por signin: ");
                _this.setState(cs);
                callback(); //aviso que todo termino bien
                console.log("Desde signin al invocar el endpoint auth en la res devuelve el id de usuario: ", data);
            });
        }
        else {
            console.error("no existe");
            callback(true);
        }
    },
    //FUNCION PARA PEDIR NUEVO ROOM---
    //lleva un cb para avisar que el nuevo room esta creado y pedir el id complejo
    askNewRoom: function (callback) {
        var _this = this;
        var cs = this.getState();
        //pregunta si tiene userId para poder crear ese room
        if (cs.userId) {
            console.log("este es el userId que llega para askNew: ", cs.userId);
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: cs.userId,
                }),
            }) //parea respuesta de la api a json pq sino es un texto
                .then(function (res) {
                return res.json();
            }) //devuelve id simple, el que se ve
                .then(function (data) {
                cs.roomId = data.id; //el facil de recordar
                _this.setState(cs);
                if (callback) {
                    callback();
                }
            });
        }
        else {
            console.error("No hay userId");
        }
    },
    //y tambien tiene un callback para avisar que termino y pueda comenzar a intercambiar msjs
    //ACCEDER A UN ROOM EXISTENTE
    accessToRoom: function (callback) {
        var _this = this;
        var cs = this.getState();
        var roomId = cs.roomId;
        fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId) //parea respuesta de la api a json pq sino es un texto
            .then(function (res) {
            return res.json();
        }) //devuelve id simple, el que se ve
            .then(function (data) {
            cs.rtdbRoomId = data.rtdbRoomId;
            _this.setState(cs);
            _this.listenRoom();
            if (callback)
                callback(); //aviso que todo termino bien
        });
    },
    //Agregar msjs a messages que viajan al backend + nombre, no altera el state
    pushMessage: function (message) {
        var cs = this.getState();
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                message: message,
                fullName: cs.fullName,
                roomId: cs.roomId,
            }),
        }).then(function (res) {
            return res.json();
        });
    },
    /////
    ///METODOS CLASICOS
    getState: function () {
        return this.data;
    },
    ////
    setState: function (newState) {
        this.data = newState;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var cb = _a[_i];
            cb();
        }
        //guardamos en el localStorage
        localStorage.setItem("state", JSON.stringify(newState));
        console.log("msjs ejecutado desde setState, Soy el state he cambiado: ", this.data);
    },
    /////
    //avisa cambios
    subscribe: function (callback) {
        this.listeners.push(callback);
    },
    //acceder a un room existente
};
exports.state = state;
