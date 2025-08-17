document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the approver signature trigger
    const approverSignatureTrigger = document.getElementById('signature-trigger-approver');
    const elaboradorSignatureTrigger = document.getElementById('signature-trigger-elaborador');
    const revisorSignatureTrigger = document.getElementById('signature-trigger-revisor');
    
    if (approverSignatureTrigger) {
        approverSignatureTrigger.addEventListener('click', function() {
            handleSignature('approver');
        });
    }
    
    if (elaboradorSignatureTrigger) {
        elaboradorSignatureTrigger.addEventListener('click', function() {
            handleSignature('elaborador');
        });
    }
    
    if (revisorSignatureTrigger) {
        revisorSignatureTrigger.addEventListener('click', function() {
            handleSignature('revisor');
        });
    }
    
    function handleSignature(type) {
        // Use the same modal that's already defined in the page
        const overlay = document.getElementById('overlay');
        const signatureModal = document.getElementById('signature-modal');
        
        if (overlay && signatureModal) {
            // Store that we're handling specific signature now
            currentSignatureIndex = type;
            
            // Show the modal
            overlay.style.display = 'block';
            signatureModal.style.display = 'block';
            
            // Make sure the canvas is properly sized
            const canvas = signatureModal.querySelector('canvas');
            if (canvas) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
                
                // Clear any existing signature
                const modalSignaturePad = new SignaturePad(canvas);
                modalSignaturePad.clear();
                
                // Override the save action for signature
                signatureModal.querySelector('[data-action="save"]').onclick = function() {
                    if (modalSignaturePad.isEmpty()) {
                        alert('Por favor, faça sua assinatura antes de salvar.');
                        return;
                    }
                    
                    const signatureData = modalSignaturePad.toDataURL();
                    document.getElementById(`signature-preview-${type}`).src = signatureData;
                    document.getElementById(`signature-preview-${type}`).style.display = 'block';
                    
                    // Add the signed-row class to the parent form-line element to hide borders
                    const signatureField = document.getElementById(`signature-trigger-${type}`);
                    if (signatureField && signatureField.closest('.form-line')) {
                        signatureField.closest('.form-line').classList.add('signed-row');
                    }
                    
                    // Close the modal
                    overlay.style.display = 'none';
                    signatureModal.style.display = 'none';
                };
            }
        }
    }
});