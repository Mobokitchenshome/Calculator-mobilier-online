document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("categoryModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.querySelector(".close");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const categoryInput = document.getElementById("categoryName");
    const messageDiv = document.getElementById("message");

    openModalBtn.onclick = () => modal.style.display = "block";
    closeModalBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

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

    function showMessage(text, isSuccess = true) {
        messageDiv.innerHTML = text;
        messageDiv.style.color = isSuccess ? "green" : "red";
        setTimeout(() => messageDiv.innerHTML = "", 3000);
    }

    async function checkCategoryExists(categoryName) {
        const snapshot = await get(ref(database, "categories/" + categoryName));
        return snapshot.exists();
    }
});