// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA9biF3OL4MSNOF9W5eKGL0snpdCyt6csU",
    authDomain: "products-d147b.firebaseapp.com",
    databaseURL: "https://products-d147b-default-rtdb.firebaseio.com",
    projectId: "products-d147b",
    storageBucket: "products-d147b.appspot.com",
    messagingSenderId: "20842043866",
    appId: "1:20842043866:web:42e9a4ebc0a3a5ff3a08e3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database; // Export database as default