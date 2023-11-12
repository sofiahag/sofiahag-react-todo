import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword,
        createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import {getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

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

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: 'Name Will Appear',
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
};
const logInWithEmailAndPassword = async (auth, email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
};
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
};
const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
};
const logout = () => {
    signOut(auth);
};
export {
    auth,
    getAuth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendPasswordReset,
    logout,
};