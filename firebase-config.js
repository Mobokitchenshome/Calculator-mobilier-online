// Importă Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";

// Configurare Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVAp7PaK7dNksfVhjXio4svEraal-7x_M",
    authDomain: "mobokitchenshome.firebaseapp.com",
    databaseURL: "https://mobokitchenshome-default-rtdb.firebaseio.com",
    projectId: "mobokitchenshome",
    storageBucket: "mobokitchenshome.appspot.com", // ✅ Corectat
    messagingSenderId: "1060936386110",
    appId: "1:1060936386110:web:cc26a6a3741b4d1bdff36f",
    measurementId: "G-E9CPCNXR7V"
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { database, storage };
