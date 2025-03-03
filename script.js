// Importă Firebase din configurația separată
import { database } from "./firebase-config.js";
import { ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 🔹 Funcție globală pentru adăugarea unei categorii
window.addCategory = function () {
    let categoryName = prompt("Introdu numele categoriei:");
    if (!categoryName) return;

    // Salvăm categoria în Firebase
    set(ref(database, "categories/" + categoryName), { subcategories: {} })
        .then(() => {
            console.log(`✅ Categoria "${categoryName}" a fost adăugată!`);
            alert(`✅ Categoria "${categoryName}" a fost adăugată!`);
        })
        .catch((error) => {
            console.error("❌ Eroare la adăugare:", error);
            alert("❌ Eroare la adăugare în Firebase.");
        });
};

// 🔹 Test - Verifică dacă Firebase salvează date
function testFirebase() {
    set(ref(database, "test"), { message: "Test Firebase" })
        .then(() => {
            console.log("✅ Datele au fost salvate cu succes în Firebase!");
        })
        .catch((error) => {
            console.error("❌ Eroare la salvare:", error);
        });
}

// 🔹 Testăm conexiunea la Firebase când pagina se încarcă
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔹 Pagina s-a încărcat!");
    testFirebase();
});
