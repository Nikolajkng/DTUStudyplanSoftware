import React from 'react'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

function ExportAsPdfBtn() {

    // Function to export the current study plan as a PDF
    // The function captures the grid as a canvas and converts it to a PDF
    const handleExportAsPDF = async () => {
        const gridElement = document.querySelector(".grid"); // Select the grid element
        if (!gridElement) {
            alert("Grid element not found!");
            return;
        }

        try {
            // Capture the grid as a canvas
            const canvas = await html2canvas(gridElement as HTMLElement, {
                scale: 2, // Increase resolution
                useCORS: true, // Handle cross-origin images
            });

            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/png");

            // Create a PDF document
            const pdf = new jsPDF("landscape", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            const planName = prompt("Angiv et navn til studieforløbet:");
            if (!planName) {
                alert("Angiv venligst et navn for at gemme studieforløb.");
                return;
            }

            // Save the PDF
            pdf.save(planName + ".pdf");
        } catch (error) {
            console.error("Error exporting grid as PDF:", error);
            alert("Der opstod en fejl under eksporten af studieforløbet.");
        }
    };
    
    return (
        <button
            onClick={handleExportAsPDF}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
            Eksportér Studieforløb som PDF
        </button>
    )
}

export default ExportAsPdfBtn