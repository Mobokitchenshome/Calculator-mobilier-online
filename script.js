import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configurare Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVAp7PaK7dNksfVhjXio4svEraal-7x_M",
    authDomain: "mobokitchenshome.firebaseapp.com",
    databaseURL: "https://mobokitchenshome-default-rtdb.firebaseio.com",
    projectId: "mobokitchenshome",
    storageBucket: "mobokitchenshome.appspot.com",
    messagingSenderId: "1060936386110",
    appId: "1:1060936386110:web:cc26a6a3741b4d1bdff36f",
    measurementId: "G-E9CPCNXR7V"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Test: Salvează un mesaj în Firebase
set(ref(database, "test"), { message: "Test Firebase" });
// 🔹 Test - Salvează date manual în Firebase
set(ref(database, "test"), { message: "Test Firebase" })
    .then(() => {
        console.log("✅ Datele au fost salvate cu succes!");
    })
    .catch((error) => {
        console.error("❌ Eroare la salvare:", error);
    });
