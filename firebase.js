import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getDatabase,
  ref,
  onValue,
  set,
  child,
  push,
  update,
} from "firebase/database";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBPgwyh3sHQrHMOSeLUQ8bWLN2Pvw-NU1U",
  authDomain: "fir-ffa0c.firebaseapp.com",
  databaseURL:
    "https://fir-ffa0c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-ffa0c",
  storageBucket: "fir-ffa0c.appspot.com",
  messagingSenderId: "1089735769356",
  appId: "1:1089735769356:web:5222b4e834215f1c3c9d29",
};

if (firebase.apps.length === 0) {
  const app = initializeApp(firebaseConfig);
}

const db = getDatabase();
const db1 = getFirestore();
export { db, db1, ref, onValue, set, child, push, update, firebase };
