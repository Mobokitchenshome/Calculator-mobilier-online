// Configurare Firebase (înlocuiește cu datele tale)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "proiectul-tau.firebaseapp.com",
    databaseURL: "https://proiectul-tau.firebaseio.com",
    projectId: "proiectul-tau",
    storageBucket: "proiectul-tau.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghij"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Datele predefinite pentru calculator
let categories = {
    "Blaturi Compact 12mm": { subcategories: { "HPL Fundermax": { quantity: 0, price: 100, image: "" } } },
    "Carcasă": { subcategories: { "Egger": { quantity: 0, price: 50, image: "" }, "Krono": { quantity: 0, price: 45, image: "" } } }
};

// Salvare date în Firebase
function saveCategories() {
    database.ref("categories").set(categories);
}

// Încărcare date din Firebase
function loadCategories() {
    database.ref("categories").once("value", snapshot => {
        if (snapshot.exists()) {
            categories = snapshot.val();
        }
        renderCalculator();
    });
}

// Afișează calculatorul pe pagină
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
                <input type="file" accept="image/*" onchange="uploadImage(this, '${category}', '${subcategory}')">
                <img id="img-${category}-${subcategory}" src="${subcat.image}" alt="Imagine" style="width: 100px; display: block;">
            `;

            div.appendChild(subDiv);
        });

        container.appendChild(div);
    });

    updateTotal();
}

// Actualizare cantitate și preț
function updateQuantity(category, subcategory, value) {
    categories[category].subcategories[subcategory].quantity = parseFloat(value) || 0;
    saveCategories();
    updateTotal();
}

function updatePrice(category, subcategory, value) {
    categories[category].subcategories[subcategory].price = parseFloat(value) || 0;
    saveCategories();
    updateTotal();
}

// Calcul total
function updateTotal() {
    let totalEuro = Object.values(categories).reduce((sum, cat) => 
        sum + Object.values(cat.subcategories).reduce((s, sub) => s + sub.quantity * sub.price, 0), 0);
    
    document.getElementById("totalEuro").textContent = totalEuro.toFixed(2);
    document.getElementById("totalLei").textContent = (totalEuro * 19).toFixed(2);
}

// Încărcare imagini
function uploadImage(input, category, subcategory) {
    let file = input.files[0];
    if (!file) return;

    let storageRef = firebase.storage().ref(`images/${category}/${subcategory}/${file.name}`);
    storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            categories[category].subcategories[subcategory].image = url;
            saveCategories();
            document.getElementById(`img-${category}-${subcategory}`).src = url;
        });
    });
}

// Export PDF
async function exportToPDF() {
    const existingPdfBytes = await fetch("Ofertă Oleg.pdf").then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.addPage([595, 842]);
    
    let y = 800;
    page.drawText("Detalii Ofertă:", { x: 50, y, size: 16 });
    y -= 20;

    Object.keys(categories).forEach(category => {
        page.drawText(category, { x: 50, y, size: 14 });
        y -= 15;

        Object.keys(categories[category].subcategories).forEach(subcategory => {
            let subcat = categories[category].subcategories[subcategory];
            page.drawText(`${subcategory}: ${subcat.quantity} x ${subcat.price}€ = ${(subcat.quantity * subcat.price).toFixed(2)}€`, { x: 60, y, size: 12 });
            y -= 15;
        });
        y -= 10;
    });

    const totalEuro = Object.values(categories).reduce((sum, cat) => 
        sum + Object.values(cat.subcategories).reduce((s, sub) => s + sub.quantity * sub.price, 0), 0);
    
    page.drawText(`Total: ${totalEuro.toFixed(2)}€`, { x: 50, y - 20, size: 16 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Oferta_Finală.pdf";
    link.click();
}

document.getElementById("exportPDF").addEventListener("click", exportToPDF);
document.addEventListener("DOMContentLoaded", loadCategories);
