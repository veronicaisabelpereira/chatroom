"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
var firebase_1 = require("firebase");
//inicializamos
var app = firebase_1.default.initializeApp({
    apiKey: "vHxims5eUHRi2vveqjumWj8hK8Yziilk6TeO48F4",
    databaseURL: "https://apx-2-ada91-default-rtdb.firebaseio.com/",
    authDomain: "apx-dwf-m6.firebaseapp.com",
});
//conexion a la base de datos en tiempo real
var rtdb = firebase_1.default.database();
exports.rtdb = rtdb;
