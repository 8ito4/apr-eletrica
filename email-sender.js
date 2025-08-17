document.addEventListener('DOMContentLoaded', function() {
    setupEmailModal();
});

function setupEmailModal() {
    // Create modal HTML structure
    const modalHTML = `
        <div id="email-overlay" class="overlay">
            <div id="email-modal" class="modal">
                <h3>Enviar Documento</h3>
                <input type="text" id="email-input" placeholder="Digite e-mail ou URL da pasta" required>
                <div class="modal-buttons">
                    <button id="cancel-email-btn" class="cancel-btn">Cancelar</button>
                    <button id="confirm-email-btn" class="confirm-btn">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('send-btn').addEventListener('click', openEmailModal);
    document.getElementById('cancel-email-btn').addEventListener('click', closeEmailModal);
    document.getElementById('confirm-email-btn').addEventListener('click', sendEmail);

    // Add styles for the email modal
    const style = document.createElement('style');
    style.textContent = `
        #email-overlay.active {
            display: block;
        }
        
        #email-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 400px;
            z-index: 2200;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        #email-modal h3 {
            margin-top: 0;
            color: #130F76;
            text-align: center;
        }
        
        #email-input {
            width: calc(100% - 16px);
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .modal-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        
        .cancel-btn {
            padding: 8px 16px;
            background-color: #f4f4f4;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .confirm-btn {
            padding: 8px 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

function openEmailModal() {
    document.getElementById('email-overlay').classList.add('active');
    document.getElementById('email-input').focus();
}

function closeEmailModal() {
    document.getElementById('email-overlay').classList.remove('active');
    document.getElementById('email-input').value = '';
}

function sendEmail() {
    const destination = document.getElementById('email-input').value.trim();
    
    if (!destination) {
        alert('Por favor, digite um endereço de e-mail ou URL válido.');
        return;
    }
    
    // Here you would implement the actual document sending functionality
    // This would typically involve a server-side component to generate and send the PDF
    
    alert(`Documento enviado para ${destination} com sucesso!`);
    closeEmailModal();
}