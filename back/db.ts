/*
Desde aca inicializamos, nos vinculamos con nuestra base de datos

*/

import * as admin from "firebase-admin";
import * as serviceAccount from "./key.json";


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-2-ada91-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
