// Importă Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// 🔹 Funcție pentru testarea Firebase
function testFirebase() {
    set(ref(database, "test"), { message: "Test Firebase" })
        .then(() => {
            console.log("✅ Datele au fost salvate cu succes în Firebase!");
        })
        .catch((error) => {
            console.error("❌ Eroare la salvare:", error);
        });
}

// 🔹 Funcție pentru adăugarea unei categorii
function addCategory() {
    let categoryName = prompt("Introdu numele categoriei:");
    if (!categoryName) return;

    // Salvăm categoria în Firebase
    set(ref(database, "categories/" + categoryName), { subcategories: {} })
        .then(() => {
            console.log(`✅ Categoria "${categoryName}" a fost adăugată!`);
        })
        .catch((error) => {
            console.error("❌ Eroare la adăugare:", error);
        });
}

// 🔹 Adaugă event listener pentru testare
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔹 Pagina s-a încărcat!");
    testFirebase();
});
