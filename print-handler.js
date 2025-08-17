document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for all print buttons in the document
    const printButtons = document.querySelectorAll('#print-btn, #print-form');
    printButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', handlePrint);
        }
    });
});

function handlePrint() {
    // Create a print-specific stylesheet
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'print-style';
    
    // CSS to control what's visible during printing
    style.innerHTML = `
        @media print {
            /* Ensure full width header with no right side cutoff */
            header, body {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
            }
            
            /* Hide the document editing section completely */
            #section3 { 
                display: none !important; 
            }
            
            header, .sidebar, .nav-buttons, #to-top, .button-group, .document-actions {
                display: none !important;
            }
            
            main {
                padding: 0;
                margin-top: 0 !important;
                width: 100% !important;
                overflow: visible !important;
            }
            
            #section1 {
                display: block !important;
                page-break-after: always;
                width: 100% !important;
            }
            
            #section4 {
                display: block !important;
                page-break-before: always;
            }
            
            #section5 {
                display: block !important;
                page-break-before: always;
            }
            
            button, .color-btn {
                display: none !important;
            }
            
            input, textarea {
                border: none !important;
                background: transparent !important;
                -webkit-appearance: none !important;
            }

            /* Preserve color backgrounds for risk assessment */
            .green-bg, .blue-bg, .yellow-bg, .orange-bg, .red-bg {
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Other styles to preserve color and content */
            * {
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Ensure proper form layout when printing */
            .form-line {
                display: flex;
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .signature-field {
                border: none !important;
                border-bottom: 1pt solid #000 !important;
            }
            
            /* Fix for tables and content width */
            .form-container, .header-table, .flex-table {
                width: 100% !important;
                max-width: 100% !important;
                table-layout: fixed !important;
            }
        }
    `;
    
    // Add the style to the head
    document.head.appendChild(style);
    
    // Trigger the print dialog
    window.print();
    
    // Remove the print-specific style after printing
    setTimeout(() => {
        const printStyle = document.getElementById('print-style');
        if (printStyle) {
            printStyle.remove();
        }
    }, 1000);
}