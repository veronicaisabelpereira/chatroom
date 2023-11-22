//Importamos custom-elements y router. Importante para que funcionen + state
import "./pages/welcome";
import "./pages/chat";
import "./router";
//import "./db";

import { state } from "./state";
//inicializa el state revisando los msjs de la base de datos
(function () {
  state.init();
  //state.listenRoom();
})();
