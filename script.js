function addCategory() {
    const calculatorDiv = document.getElementById("calculator");

    // Creați un nou div pentru noua categorie
    const newCategoryDiv = document.createElement("div");
    newCategoryDiv.classList.add("category");

    // Adăugați un câmp de intrare pentru noua categorie
    const newInput = document.createElement("input");
    newInput.type = "number";
    newInput.placeholder = "Valoare";
    newInput.addEventListener("input", calculateTotals);

    // Adăugați câmpul de intrare în noul div
    newCategoryDiv.appendChild(newInput);

    // Adăugați noul div în div-ul calculatorului
    calculatorDiv.appendChild(newCategoryDiv);
}

document.addEventListener("DOMContentLoaded", () => {
    const fields = document.querySelectorAll(".field-group h2");
    const totalEuroElem = document.getElementById("totalEuro");
    const totalLeiElem = document.getElementById("totalLei");
    const exchangeRate = 19;

    fields.forEach(field => {
        field.addEventListener("click", () => {
            const subfields = field.nextElementSibling;
            subfields.style.display = subfields.style.display === "none" ? "block" : "none";
        });
    });

    const inputs = document.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.addEventListener("input", calculateTotals);
    });

    function calculateTotals() {
        let totalEuro = 0;
        const inputs = document.querySelectorAll("#calculator input[type='number']");
        inputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            totalEuro += value;
        });
        const totalLei = totalEuro * exchangeRate;
        totalEuroElem.innerText = totalEuro.toFixed(2);
        totalLeiElem.innerText = totalLei.toFixed(2);
    }
});