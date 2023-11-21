"use strict";
/*
Desde aca inicializamos, nos vinculamos con nuestra base de datos

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-2-ada91-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
