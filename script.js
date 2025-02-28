let categories = {};

// Adaugă o categorie nouă
function addCategory() {
    let categoryName = prompt("Introdu numele categoriei:");
    if (!categoryName) return;
    categories[categoryName] = { subcategories: {} };
    saveCategories();
    renderCategories();
}

// Adaugă o subcategorie
function addSubcategory(category) {
    let subcategoryName = prompt("Introdu numele subcategoriei:");
    if (!subcategoryName) return;
    categories[category].subcategories[subcategoryName] = { quantity: 0, price: 0, image: "" };
    saveCategories();
    renderCategories();
}

// Render UI
function renderCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    Object.keys(categories).forEach(category => {
        let catDiv = document.createElement("div");
        catDiv.classList.add("category");
        catDiv.innerHTML = `<h3>${category}</h3> <button onclick="addSubcategory('${category}')">Adaugă Subcategorie</button>`;

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

            catDiv.appendChild(subDiv);
            loadImages(category, subcategory);
        });

        container.appendChild(catDiv);
    });
}

// Actualizează cantitatea
function updateQuantity(category, subcategory, value) {
    categories[category].subcategories[subcategory].quantity = value;
    saveCategories();
}

// Actualizează prețul
function updatePrice(category, subcategory, value) {
    categories[category].subcategories[subcategory].price = value;
    saveCategories();
}

// Salvează datele în Firebase
function saveCategories() {
    database.ref("categories").set(categories);
}

// Încarcă datele din Firebase
function loadCategories() {
    database.ref("categories").once("value", snapshot => {
        if (snapshot.exists()) {
            categories = snapshot.val();
            renderCategories();
        }
    });
}

// Încărcare imagine în Firebase Storage
function uploadImage(input, category, subcategory) {
    let file = input.files[0];
    if (!file) return;

    let storageRef = storage.ref(`images/${category}/${subcategory}/${file.name}`);
    storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            categories[category].subcategories[subcategory].image = url;
            saveCategories();
            document.getElementById(`img-${category}-${subcategory}`).src = url;
        });
    });
}

// Încarcă imaginile salvate
function loadImages(category, subcategory) {
    database.ref(`categories/${category}/subcategories/${subcategory}/image`).once("value", snapshot => {
        if (snapshot.exists()) {
            document.getElementById(`img-${category}-${subcategory}`).src = snapshot.val();
        }
    });
}

// Exportă oferta în PDF
function exportToPDF() {
    const doc = new jsPDF();
    doc.text("Oferta Mobilier", 10, 10);
    
    let y = 20;
    Object.keys(categories).forEach(category => {
        doc.text(category, 10, y);
        y += 10;

        Object.keys(categories[category].subcategories).forEach(subcategory => {
            let sub = categories[category].subcategories[subcategory];
            doc.text(`${subcategory}: ${sub.quantity} buc/m2 - ${sub.price} €`, 10, y);
            y += 10;
        });

        y += 10;
    });

    doc.save("Oferta_Mobilier.pdf");
}

document.addEventListener("DOMContentLoaded", loadCategories);
