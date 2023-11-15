import firebase from "firebase";
//inicializamos
const app = firebase.initializeApp({
  apiKey: "vHxims5eUHRi2vveqjumWj8hK8Yziilk6TeO48F4",
  databaseURL: "https://apx-2-ada91-default-rtdb.firebaseio.com/",
  authDomain: "apx-dwf-m6.firebaseapp.com",
});

//conexion a la base de datos en tiempo real
const rtdb = firebase.database();

export { rtdb };
