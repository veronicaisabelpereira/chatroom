import { rtdb } from "./db";
//para tratar un objeto de objetos como un array
import { map } from "lodash";
const API_BASE_URL = "https://chatroom-fxip.onrender.com"
//"http://localhost:3000";

//
const state = {
  data: {
    fullName: "",
    userId: "", //lo devuelve el metodo signin que llama al endpoint auth--id de users en firebase
    roomId: "", //id simple, el que se muestra
    email: "",
    messages: [],
    rtdbRoomId: "", //id complejo
  },
  listeners: [], //funciones que se invocan cada vez que alguien modifica el estado
  init() {
    const lastStorageState = localStorage.getItem("state");
  },

  //usa el rtdbRoomId
  listenRoom() {
    const cs = this.getState();
    //Referencia al lugar de la base de datos
    const chatroomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    //Escuchamos cambios
    chatroomRef.on("value", (snapshot) => {
      //optener ultima version del estado cada vez que cambia
      const currentState = this.getState();
      const messageFromServer = snapshot.val();
      console.log(messageFromServer);
      const messagesList = map(messageFromServer.messages);
      currentState.messages = messagesList;
      this.setState(currentState);
    });
  },

  //METODOS ESPECIFICOS
  //Setear valores a las propiedades de data:
  //email y fullName
  //roomId
  //messages

  setEmailAndFullname(email: string, fullName: string) {
    const cs = this.getState();
    cs.email = email;
    cs.fullName = fullName;
    this.setState(cs);
  },
  setRoomId(roomId: string) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
  },
  setMessage(message: String) {
    const cs = this.getState();
    cs.messages.push({ message, fullName: cs.fullName });
  },

  //METODO PARA AUTENTICARSE
  signIn(callback) {
    const cs = this.getState();
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
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          console.log("Cambio el state por signin: ");
          this.setState(cs);
          callback(); //aviso que todo termino bien

          console.log(
            "Desde signin al invocar el endpoint auth en la res devuelve el id de usuario: ",
            data
          );
        });
    } else {
      console.error("no existe");
      callback(true);
    }
  },

  //FUNCION PARA PEDIR NUEVO ROOM---
  //lleva un cb para avisar que el nuevo room esta creado y pedir el id complejo

  askNewRoom(callback?) {
    const cs = this.getState();

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
        .then((res) => {
          return res.json();
        }) //devuelve id simple, el que se ve
        .then((data) => {
          cs.roomId = data.id; //el facil de recordar
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay userId");
    }
  },

  //y tambien tiene un callback para avisar que termino y pueda comenzar a intercambiar msjs
  //ACCEDER A UN ROOM EXISTENTE
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId) //parea respuesta de la api a json pq sino es un texto
      .then((res) => {
        return res.json();
      }) //devuelve id simple, el que se ve
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) callback(); //aviso que todo termino bien
      });
  },
  //Agregar msjs a messages que viajan al backend + nombre, no altera el state
  pushMessage(message) {
    const cs = this.getState();
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
    }).then((res) => {
      return res.json();
    });
  },
  /////
  ///METODOS CLASICOS
  getState() {
    return this.data;
  },
  ////
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    //guardamos en el localStorage
    localStorage.setItem("state", JSON.stringify(newState));
    console.log(
      "msjs ejecutado desde setState, Soy el state he cambiado: ",
      this.data
    );
  },
  /////
  //avisa cambios
  subscribe(callback: any) {
    this.listeners.push(callback);
  },

  //acceder a un room existente
};

export { state };
