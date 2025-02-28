async function exportToPDF() {
    // Încarcă PDF-ul existent
    const existingPdfBytes = await fetch("Ofertă Oleg.pdf").then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    
    // Adaugă o nouă pagină pentru datele din calculator
    const page = pdfDoc.addPage([595, 842]); // Format A4
    let y = 800; // Poziționare inițială
    
    page.drawText("Detalii Ofertă:", { x: 50, y, size: 16 });
    y -= 20;

    // Adaugă detaliile din calculator
    Object.keys(categories).forEach(category => {
        page.drawText(category, { x: 50, y, size: 14, color: PDFLib.rgb(0, 0, 1) });
        y -= 15;

        Object.keys(categories[category].subcategories).forEach(subcategory => {
            const subcat = categories[category].subcategories[subcategory];
            page.drawText(`${subcategory}: ${subcat.quantity} x ${subcat.price}€ = ${(subcat.quantity * subcat.price).toFixed(2)}€`, { x: 60, y, size: 12 });
            y -= 15;

            // Adaugă imaginea dacă există
            if (subcat.image) {
                fetch(subcat.image)
                    .then(res => res.arrayBuffer())
                    .then(imgBytes => pdfDoc.embedJpg(imgBytes))
                    .then(img => {
                        page.drawImage(img, { x: 350, y: y - 30, width: 100, height: 100 });
                    });
                y -= 120; // Ajustează spațiul pentru imagine
            }
        });
        y -= 10;
    });

    // Adaugă totalul
    const totalEuro = Object.values(categories).reduce((sum, cat) => sum + Object.values(cat.subcategories).reduce((s, sub) => s + sub.quantity * sub.price, 0), 0);
    page.drawText(`Total: ${totalEuro.toFixed(2)}€`, { x: 50, y: y - 20, size: 16, color: PDFLib.rgb(1, 0, 0) });

    // Salvează și descarcă PDF-ul
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Oferta_Finală.pdf";
    link.click();
}

document.getElementById("exportPDF").addEventListener("click", exportToPDF);
