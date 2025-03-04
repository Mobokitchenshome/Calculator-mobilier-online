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
        inputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            totalEuro += value;
        });
        const totalLei = totalEuro * exchangeRate;
        totalEuroElem.innerText = totalEuro.toFixed(2);
        totalLeiElem.innerText = totalLei.toFixed(2);
    }
});