"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Importamos custom-elements y router. Importante para que funcionen + state
require("./pages/welcome");
require("./pages/chat");
require("./router");
//import "./db";
const state_1 = require("./state");
//inicializa el state revisando los msjs de la base de datos
(function () {
    state_1.state.init();
    state_1.state.listenRoom();
})();
