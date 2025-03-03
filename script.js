// Importă Firebase din configurația separată
import { database } from "./firebase-config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Elemente HTML
const modal = document.getElementById("categoryModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.querySelector(".close");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryInput = document.getElementById("categoryName");
const messageDiv = document.getElementById("message");

// Deschidere și închidere modal
openModalBtn.onclick = () => modal.style.display = "block";
closeModalBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// Afișare mesaje de succes sau eroare
function showMessage(text, isSuccess = true) {
    messageDiv.innerHTML = text;
    messageDiv.style.color = isSuccess ? "green" : "red";
    setTimeout(() => messageDiv.innerHTML = "", 3000);
}

// Verifică dacă categoria există deja
async function checkCategoryExists(categoryName) {
    const snapshot = await get(ref(database, "categories/" + categoryName));
    return snapshot.exists();
}

// Adaugă categorie
addCategoryBtn.onclick = async function () {
    let categoryName = categoryInput.value.trim();
    if (!categoryName) return showMessage("❌ Introdu un nume pentru categorie!", false);

    if (await checkCategoryExists(categoryName)) {
        return showMessage("❌ Categoria există deja!", false);
    }

    set(ref(database, "categories/" + categoryName), { subcategories: {} })
        .then(() => {
            showMessage(`✅ Categoria "${categoryName}" a fost adăugată!`);
            categoryInput.value = "";
            modal.style.display = "none";
        })
        .catch(() => showMessage("❌ Eroare la adăugare în Firebase.", false));
};

// Test Firebase la încărcarea paginii
document.addEventListener("DOMContentLoaded", () => {
    set(ref(database, "test"), { message: "Test Firebase" })
        .then(() => console.log("✅ Firebase funcționează!"))
        .catch(() => console.error("❌ Eroare la conectare."));
});
