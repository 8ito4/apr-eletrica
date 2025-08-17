document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the "Implementar" button
    const implementBtn = document.getElementById('implement-btn');
    
    if (implementBtn) {
        implementBtn.addEventListener('click', function() {
            // Get the title text from the textarea
            const titleText = document.getElementById('document-title').value.trim();
            
            // Find the table title element in section 1
            const tableTitle = document.querySelector('.table-title');
            
            // Update the table title if text is provided
            if (titleText && tableTitle) {
                tableTitle.textContent = titleText;
                
                // Visual feedback
                const originalText = implementBtn.textContent;
                implementBtn.textContent = "Implementado!";
                setTimeout(() => {
                    implementBtn.textContent = originalText;
                }, 1000);
            } else {
                alert('Por favor, digite um título para implementar.');
            }
        });
    }
});