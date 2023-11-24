import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBdWuWZHhnCKiSQ1Sk5EDgP1MjE-YUCrV8",
    authDomain: "sofiahag-todo-db.firebaseapp.com",
    projectId: "sofiahag-todo-db",
    storageBucket: "sofiahag-todo-db.appspot.com",
    messagingSenderId: "219163789306",
    appId: "1:219163789306:web:f3c854a0b6a4b7738a4643",
    measurementId: "G-RZ6Z3VXKDD"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
export { db, auth }
