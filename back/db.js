"use strict";
/*
Desde aca inicializamos, nos vinculamos con nuestra base de datos

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-2-ada91-default-rtdb.firebaseio.com",
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
