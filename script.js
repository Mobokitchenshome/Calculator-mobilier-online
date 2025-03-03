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

// Categoriile inițiale
const defaultCategories = {
    "Blaturi Compact 12mm": {
        subcategories: {
            "HPL Fundermax": { quantity: 0, price: 100 },
            "HPL Smart": { quantity: 0, price: 120 }
        }
    },
    "Carcasă": {
        subcategories: {
            "Egger": { quantity: 0, price: 50 },
            "Krono": { quantity: 0, price: 45 }
        }
    }
};

// Salvare automată în Firebase
function saveToFirebase() {
    set(ref(database, "calculator"), categories);
}

// Încărcare date salvate din Firebase
function loadFromFirebase() {
    const dbRef = ref(database, "calculator");
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            categories = snapshot.val();
        } else {
            categories = defaultCategories;
            saveToFirebase(); // Salvăm categoriile inițiale dacă nu există date
        }
        renderCalculator();
    });
}

// Ascultă modificările și actualizează interfața în timp real
onValue(ref(database, "calculator"), (snapshot) => {
    if (snapshot.exists()) {
        categories = snapshot.val();
        renderCalculator();
    }
});

// Funcție pentru afișarea calculatorului
function renderCalculator() {
    const container = document.getElementById("calculator");
    container.innerHTML = "";

    Object.keys(categories).forEach(category => {
        let div = document.createElement("div");
        div.classList.add("category");
        div.innerHTML = `<h3>${category}</h3>`;

        Object.keys(categories[category].subcategories).forEach(subcategory => {
            let subcat = categories[category].subcategories[subcategory];
            let subDiv = document.createElement("div");
            subDiv.classList.add("subcategory");

            subDiv.innerHTML = `
                <label>${subcategory}</label>
                <input type="number" placeholder="Cantitate" value="${subcat.quantity}" onchange="updateQuantity('${category}', '${subcategory}', this.value)">
                <input type="number" placeholder="Preț (€)" value="${subcat.price}" onchange="updatePrice('${category}', '${subcategory}', this.value)">
            `;

            div.appendChild(subDiv);
        });

        container.appendChild(div);
    });

    updateTotal();
}

// Actualizare cantitate
function updateQuantity(category, subcategory, value) {
    categories[category].subcategories[subcategory].quantity = parseFloat(value) || 0;
    saveToFirebase();
    updateTotal();
}

// Actualizare preț
function updatePrice(category, subcategory, value) {
    categories[category].subcategories[subcategory].price = parseFloat(value) || 0;
    saveToFirebase();
    updateTotal();
}

// Calcul total
function updateTotal() {
    let totalEuro = Object.values(categories).reduce((sum, cat) => 
        sum + Object.values(cat.subcategories).reduce((s, sub) => s + sub.quantity * sub.price, 0), 0);
    
    document.getElementById("totalEuro").textContent = totalEuro.toFixed(2);
    document.getElementById("totalLei").textContent = (totalEuro * 19).toFixed(2);
}

// Inițializare
document.addEventListener("DOMContentLoaded", loadFromFirebase);
