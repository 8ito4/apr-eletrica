// Function to generate and download a ZIP file of the current document state
function generateDocumentZip() {
    // Show loading indicator
    const generateBtn = document.getElementById('generate-btn');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = "Gerando...";
    generateBtn.disabled = true;
    
    // Use JSZip library (load it dynamically)
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = function() {
        const zip = new JSZip();
        
        // Create a copy of the current HTML with all user changes
        const documentCopy = document.documentElement.cloneNode(true);
        
        // Remove unwanted elements from the copy
        removeUnwantedElements(documentCopy);
        
        // Capture all current styles and scripts
        captureStyles(zip);
        captureScripts(zip);
        
        // Create HTML file with current state
        const htmlContent = '<!DOCTYPE html>\n' + documentCopy.outerHTML;
        zip.file("index.html", htmlContent);
        
        // Generate the zip file
        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                // Create download link
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                link.href = URL.createObjectURL(content);
                link.download = `APR-documento-${timestamp}.zip`;
                link.click();
                
                // Restore button state
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
                alert('Documento gerado com sucesso!');
            })
            .catch(function(error) {
                console.error("Erro ao gerar o documento:", error);
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
                alert('Erro ao gerar o documento. Por favor, tente novamente.');
            });
    };
    
    script.onerror = function() {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
        alert('Erro ao carregar as dependências. Por favor, verifique sua conexão com a internet.');
    };
    
    document.head.appendChild(script);
}

function removeUnwantedElements(documentCopy) {
    // Remove overlay and modals
    const elementsToRemove = documentCopy.querySelectorAll('.overlay, .signature-modal');
    elementsToRemove.forEach(el => el.parentNode.removeChild(el));
    
    // Hide sections that are not visible
    const hiddenSections = documentCopy.querySelectorAll('section[style*="display: none"]');
    hiddenSections.forEach(section => {
        section.style.display = ""; // Reset to enable proper navigation in the downloaded copy
    });
    
    // Capture current form values
    const inputs = documentCopy.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked');
        } else {
            const originalInput = document.getElementById(input.id);
            if (originalInput) {
                input.value = originalInput.value;
                if (input.hasAttribute('placeholder')) {
                    input.setAttribute('placeholder', originalInput.getAttribute('placeholder'));
                }
            }
        }
    });
    
    // Capture contenteditable contents
    const editableElements = documentCopy.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        const originalElement = Array.from(document.querySelectorAll('[contenteditable="true"]'))
            .find(el => el.innerHTML === element.innerHTML);
        if (originalElement) {
            element.innerHTML = originalElement.innerHTML;
        }
    });
    
    // Capture signature images
    const signatureImages = documentCopy.querySelectorAll('.signature-preview');
    signatureImages.forEach(img => {
        const originalImg = document.querySelector(`#${img.id}`);
        if (originalImg && originalImg.src) {
            img.src = originalImg.src;
            if (originalImg.style.display) {
                img.style.display = originalImg.style.display;
            }
        }
    });
}

function captureStyles(zip) {
    // Get all linked stylesheets
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    styleLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            fetch(href)
                .then(response => response.text())
                .then(cssContent => {
                    zip.file(href, cssContent);
                })
                .catch(error => console.error(`Failed to fetch stylesheet: ${href}`, error));
        }
    });
    
    // Get all inline styles
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach((style, index) => {
        zip.file(`inline-style-${index}.css`, style.textContent);
    });
}

function captureScripts(zip) {
    // Get all scripts
    const scriptElements = document.querySelectorAll('script:not([src*="cdnjs"])');
    scriptElements.forEach(script => {
        if (script.src) {
            const src = script.getAttribute('src');
            fetch(src)
                .then(response => response.text())
                .then(jsContent => {
                    zip.file(src, jsContent);
                })
                .catch(error => console.error(`Failed to fetch script: ${src}`, error));
        } else if (script.textContent && !script.textContent.includes('document.write')) {
            // Skip any potentially problematic scripts that use document.write
            const scriptName = script.id ? `inline-script-${script.id}.js` : `inline-script-${Math.random().toString(36).substring(7)}.js`;
            zip.file(scriptName, script.textContent);
        }
    });
    
    // Add our document generator script
    zip.file("document-generator.js", document.querySelector('script[src="document-generator.js"]')?.textContent || "");
}