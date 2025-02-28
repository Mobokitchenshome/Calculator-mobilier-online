let categories = JSON.parse(localStorage.getItem("categories")) || {};

function init() {
    renderCategories();
    calculateTotal();
}

// Generare câmpuri
function renderCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    for (let category in categories) {
        let div = document.createElement("div");
        div.classList.add("category");

        let titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = category;
        titleInput.classList.add("category-title");
        titleInput.onchange = () => editCategoryName(category, titleInput.value);

        let toggleBtn = document.createElement("button");
        toggleBtn.textContent = "▼";
        toggleBtn.onclick = () => toggleSubfields(category);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✖";
        deleteBtn.onclick = () => deleteCategory(category);

        let header = document.createElement("div");
        header.appendChild(titleInput);
        header.appendChild(toggleBtn);
        header.appendChild(deleteBtn);

        div.appendChild(header);

        let subfieldsDiv = document.createElement("div");
        subfieldsDiv.id = category;
        subfieldsDiv.classList.add("subfields");

        categories[category].forEach((item, index) => {
            let label = document.createElement("div");

            let inputName = document.createElement("input");
            inputName.type = "text";
            inputName.value = item.name;
            inputName.classList.add("subfield-name");
            inputName.onchange = () => editSubfield(category, index, inputName.value);

            let priceInput = document.createElement("input");
            priceInput.type = "number";
            priceInput.value = item.price;
            priceInput.classList.add("price-input");
            priceInput.oninput = () => {
                categories[category][index].price = parseFloat(priceInput.value) || 0;
                saveCategories();
                calculateTotal();
            };

            let quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = item.quantity || 1;
            quantityInput.classList.add("quantity-input");
            quantityInput.oninput = () => {
                categories[category][index].quantity = parseFloat(quantityInput.value) || 1;
                saveCategories();
                calculateTotal();
            };

            let unitSelect = document.createElement("select");
            unitSelect.classList.add("unit-select");
            unitSelect.innerHTML = `
                <option value="buc" ${item.unit === "buc" ? "selected" : ""}>buc</option>
                <option value="m²" ${item.unit === "m²" ? "selected" : ""}>m²</option>
            `;
            unitSelect.onchange = () => {
                categories[category][index].unit = unitSelect.value;
                saveCategories();
                calculateTotal();
            };

            let deleteSubBtn = document.createElement("button");
            deleteSubBtn.textContent = "✖";
            deleteSubBtn.onclick = () => deleteSubfield(category, index);

            label.appendChild(inputName);
            label.appendChild(priceInput);
            label.appendChild(quantityInput);
            label.appendChild(unitSelect);
            label.appendChild(deleteSubBtn);
            subfieldsDiv.appendChild(label);
        });

        let addSubBtn = document.createElement("button");
        addSubBtn.textContent = "+ Adaugă subcâmp";
        addSubBtn.onclick = () => addSubfield(category);

        subfieldsDiv.appendChild(addSubBtn);
        div.appendChild(subfieldsDiv);
        container.appendChild(div);
    }
}

// Afișare/ascundere subcâmpuri
function toggleSubfields(id) {
    let element = document.getElementById(id);
    element.style.display = element.style.display === "none" ? "block" : "none";
}

// Adăugare categorie nouă
function addCategory() {
    let name = prompt("Introduceți numele categoriei:");
    if (name && !categories[name]) {
        categories[name] = [];
        saveCategories();
        renderCategories();
    }
}

// Editare nume categorie
function editCategoryName(oldName, newName) {
    if (newName && oldName !== newName && !categories[newName]) {
        categories[newName] = categories[oldName];
        delete categories[oldName];
        saveCategories();
        renderCategories();
    }
}

// Ștergere categorie
function deleteCategory(category) {
    delete categories[category];
    saveCategories();
    renderCategories();
}

// Adăugare subcâmp
function addSubfield(category) {
    let name = prompt("Introduceți numele subcâmpului:");
    if (name) {
        categories[category].push({ name, price: 0, quantity: 1, unit: "buc" });
        saveCategories();
        renderCategories();
    }
}

// Editare subcâmp
function editSubfield(category, index, newName) {
    categories[category][index].name = newName;
    saveCategories();
}

// Ștergere subcâmp
function deleteSubfield(category, index) {
    categories[category].splice(index, 1);
    saveCategories();
    renderCategories();
}

// Salvare date
function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

// Calcul totaluri
function calculateTotal() {
    let totalEuro = 0;
    for (let category in categories) {
        categories[category].forEach(item => {
            totalEuro += item.price * item.quantity;
        });
    }
    
    document.getElementById("total-euro").textContent = totalEuro.toFixed(2);
    document.getElementById("total-lei").textContent = (totalEuro * 19).toFixed(2);
}

// Inițializare
document.addEventListener("DOMContentLoaded", init);
