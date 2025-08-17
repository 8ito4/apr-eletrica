document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let currentPage = 0;
    const pages = document.querySelectorAll("main section");
    const pageIndicator = document.getElementById('page-indicator');
    let signaturePad;
    let currentSignatureIndex = null;
    let activeColorButton = null;
    
    // Atualizar data e hora
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Debug: Verificar se todos os botões existem
    console.log("=== DEBUG DOS BOTÕES ===");
    const buttonIds = ['page1-next', 'page2-prev', 'page2-next', 'page3-prev', 'page3-next', 'page4-prev', 'download-pdf', 'download-word', 'print-form'];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            console.log(`✅ Botão ${id} encontrado:`, btn);
        } else {
            console.log(`❌ Botão ${id} NÃO encontrado`);
        }
    });
    console.log("========================");
    
    // Inicializar pad de assinatura principal para aprovação
    if (document.getElementById('signature-canvas')) {
        signaturePad = new SignaturePad(document.getElementById('signature-canvas'));
        
        document.getElementById('clear-signature').addEventListener('click', function() {
            signaturePad.clear();
        });
    }
    
    // Inicializar modal de assinatura para executantes
    const signatureModal = document.getElementById('signature-modal');
    const overlay = document.getElementById('overlay');
    
    if (signatureModal) {
        const canvas = signatureModal.querySelector('canvas');
        const modalSignaturePad = new SignaturePad(canvas);
        
        // Abrir modal ao clicar nos campos de assinatura
        document.querySelectorAll('[id^="signature-trigger"]').forEach((trigger, index) => {
            trigger.addEventListener('click', function() {
                currentSignatureIndex = index + 1;
                overlay.style.display = 'block';
                signatureModal.style.display = 'block';
                // Ajustar o tamanho do canvas
                resizeCanvas();
                modalSignaturePad.clear();
            });
        });
        
        // Botões do modal
        signatureModal.querySelector('[data-action="clear"]').addEventListener('click', function() {
            modalSignaturePad.clear();
        });
        
        signatureModal.querySelector('[data-action="save"]').addEventListener('click', function() {
            if (modalSignaturePad.isEmpty()) {
                alert('Por favor, faça sua assinatura antes de salvar.');
                return;
            }
            const signatureData = modalSignaturePad.toDataURL();
            document.getElementById(`signature-preview${currentSignatureIndex}`).src = signatureData;
            document.getElementById(`signature-preview${currentSignatureIndex}`).style.display = 'block';
            
            // Add the signed-row class to the parent form-line element to hide borders
            const signatureField = document.getElementById(`signature-trigger${currentSignatureIndex}`);
            if (signatureField && signatureField.closest('.form-line')) {
                signatureField.closest('.form-line').classList.add('signed-row');
            }
            
            closeModal();
        });
        
        // Fechar modal clicando fora
        overlay.addEventListener('click', closeModal);
        
        function closeModal() {
            overlay.style.display = 'none';
            signatureModal.style.display = 'none';
        }
        
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            modalSignaturePad.clear();
        }
        
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Funções de navegação
    function showPage(index) {
        if (index >= 0 && index < pages.length) {
            pages.forEach((page, i) => {
                page.style.display = i === index ? "block" : "none";
            });
            currentPage = index;
            pageIndicator.textContent = `${currentPage + 1}/${pages.length}`;
            
            // Rolar para o topo suavemente
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    // Mostrar a primeira página
    showPage(currentPage);
    
    // Botões de navegação
    document.getElementById("next-btn").addEventListener("click", function() {
        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        }
    });
    
    document.getElementById("prev-btn").addEventListener("click", function() {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    });
    
    // Novos botões de navegação entre páginas
    // Página 1 -> Página 2
    const page1NextBtn = document.getElementById("page1-next");
    if (page1NextBtn) {
        page1NextBtn.addEventListener("click", function() {
            console.log("Botão page1-next clicado");
            showPage(1); // Vai para "Edição do Documento"
        });
    } else {
        console.error("Botão page1-next não encontrado");
    }
    
    // Página 2 (botões anterior e próximo)
    const page2PrevBtn = document.getElementById("page2-prev");
    if (page2PrevBtn) {
        page2PrevBtn.addEventListener("click", function() {
            console.log("Botão page2-prev clicado");
            showPage(0); // Volta para "Documento"
        });
    }
    
    const page2NextBtn = document.getElementById("page2-next");
    if (page2NextBtn) {
        page2NextBtn.addEventListener("click", function() {
            console.log("Botão page2-next clicado");
            showPage(2); // Vai para "Revisões"
        });
    }
    
    // Página 3 (botões anterior e próximo)
    const page3PrevBtn = document.getElementById("page3-prev");
    if (page3PrevBtn) {
        page3PrevBtn.addEventListener("click", function() {
            console.log("Botão page3-prev clicado");
            showPage(1); // Volta para "Edição do Documento"
        });
    }
    
    const page3NextBtn = document.getElementById("page3-next");
    if (page3NextBtn) {
        page3NextBtn.addEventListener("click", function() {
            console.log("Botão page3-next clicado");
            showPage(3); // Vai para "Aprovação"
        });
    }
    
    // Página 4 (botão anterior)
    const page4PrevBtn = document.getElementById("page4-prev");
    if (page4PrevBtn) {
        page4PrevBtn.addEventListener("click", function() {
            console.log("Botão page4-prev clicado");
            showPage(2); // Volta para "Revisões"
        });
    }
    
    // Funcionalidade de download PDF
    const downloadPdfBtn = document.getElementById("download-pdf");
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener("click", function() {
            console.log("Botão download-pdf clicado");
            generatePDF();
        });
    } else {
        console.error("Botão download-pdf não encontrado");
    }
    
    // Funcionalidade de download Word
    const downloadWordBtn = document.getElementById("download-word");
    if (downloadWordBtn) {
        downloadWordBtn.addEventListener("click", function() {
            console.log("Botão download-word clicado");
            generateWord();
        });
    } else {
        console.error("Botão download-word não encontrado");
    }
    
    // Funcionalidade de imprimir
    const printFormBtn = document.getElementById("print-form");
    if (printFormBtn) {
        printFormBtn.addEventListener("click", function() {
            console.log("Botão print-form clicado");
            generatePDF();
        });
    } else {
        console.error("Botão print-form não encontrado");
    }
    
    // Menu lateral
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    document.getElementById('close-menu').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('active');
    });
    
    // Links do menu
    document.querySelectorAll('.sidebar nav ul li a').forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(index);
            document.getElementById('sidebar').classList.remove('active');
        });
    });
    
    // Botão "Voltar ao topo"
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            document.getElementById('to-top').style.display = 'block';
        } else {
            document.getElementById('to-top').style.display = 'none';
        }
    });
    
    document.getElementById('to-top').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Botões de ação da seção de revisões
    if (document.getElementById('add-revision-btn')) {
        document.getElementById('add-revision-btn').addEventListener('click', function() {
            const table = document.getElementById('revision-history-table');
            const newRow = table.insertRow(-1);
            
            newRow.innerHTML = `
                <td><input type="text" class="revision-input number-input" placeholder="Digite"></td>
                <td><input type="date" class="revision-input date-input"></td>
                <td><input type="text" class="revision-input desc-input" placeholder="Digite a descrição"></td>
            `;
        });
    }
    
    if (document.getElementById('save-revisions-btn')) {
        document.getElementById('save-revisions-btn').addEventListener('click', function() {
            alert('Revisões salvas com sucesso!');
        });
    }
    
    // Botões de ação do documento
    const actionButtons = ['implement-btn', 'save-btn', 'generate-btn'];
    actionButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', function() {
                const action = this.id.split('-')[0];
                switch (action) {
                    case 'implement':
                        const title = document.getElementById('document-title').value;
                        alert(`Documento "${title}" implementado com sucesso!`);
                        break;
                    case 'save':
                        alert('Documento salvo com sucesso!');
                        break;
                    case 'generate':
                        generateDocumentZip();
                        break;
                }
            });
        }
    });
    
    // Botões de salvar e imprimir APR
    if (document.getElementById('save-form')) {
        document.getElementById('save-form').addEventListener('click', function() {
            alert('APR salva com sucesso!');
        });
    }
    
    // Funções auxiliares
    function updateDateTime() {
        const now = new Date();
        
        // Data atual
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', options);
        
        // Dia da semana
        const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
        document.getElementById('weekday').textContent = days[now.getDay()];
        
        // Hora atual
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}`;
        
        // Código de rastreio
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trackingCode = months[now.getMonth()] + now.getDate() + (now.getMonth() + 1) + now.getFullYear() + now.getHours() + now.getMinutes() + now.getSeconds();
        document.getElementById('tracking-code').textContent = trackingCode;
    }
    
    function generateDocumentZip() {
        // This function is assumed to be implemented elsewhere in the codebase
    }
});

// Função adicional para testar se os botões funcionam
function testButtons() {
    console.log("Testando botões...");
    
    // Testar se o elemento page1-next existe
    const page1Next = document.getElementById('page1-next');
    if (page1Next) {
        console.log("page1-next encontrado:", page1Next);
        page1Next.style.backgroundColor = 'red'; // Teste visual
    }
    
    // Listar todos os botões com classe page-nav-btn
    const navBtns = document.querySelectorAll('.page-nav-btn');
    console.log("Botões de navegação encontrados:", navBtns.length);
    navBtns.forEach((btn, index) => {
        console.log(`Botão ${index}:`, btn.id, btn.textContent);
    });
    
    // Listar todos os botões com classe final-btn
    const finalBtns = document.querySelectorAll('.final-btn');
    console.log("Botões finais encontrados:", finalBtns.length);
    finalBtns.forEach((btn, index) => {
        console.log(`Botão final ${index}:`, btn.id, btn.textContent);
    });
}

// Função para gerar PDF - TODAS AS 4 PÁGINAS COM DIMENSÃO DE TELA
function generatePDF() {
    console.log("Iniciando geração de PDF - TODAS as 4 páginas...");
    
    try {
        // Criar uma nova janela para impressão/PDF
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
            alert('Pop-up bloqueado! Permita pop-ups para gerar o PDF.');
            return;
        }
        
        // Capturar TODAS as 4 seções
        const allSections = [
            document.getElementById('section1'),  // Documento
            document.getElementById('section3'),  // Edição do Documento
            document.getElementById('section4'),  // Revisões
            document.getElementById('section5')   // Aprovação
        ];
        
        // Verificar se todas as seções existem
        for (let i = 0; i < allSections.length; i++) {
            if (!allSections[i]) {
                alert(`Erro: Seção ${i + 1} não encontrada.`);
                return;
            }
        }
        
        // Capturar TODOS os CSS da página atual
        let allCSS = '';
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
            try {
                if (sheet.cssRules) {
                    Array.from(sheet.cssRules).forEach(rule => {
                        allCSS += rule.cssText + '\n';
                    });
                }
            } catch (e) {
                console.log('CSS cross-origin ignorado');
            }
        });
        
        // Clonar TODAS as seções SEM ALTERAR NADA
        let allContentHTML = '';
        
        allSections.forEach((section, index) => {
            if (section) {
                // Tornar a seção visível temporariamente para capturar
                const originalDisplay = section.style.display;
                section.style.display = 'block';
                
                // Clonar a seção completa
                const clonedSection = section.cloneNode(true);
                
                // Remover APENAS os botões de navegação
                const buttonsToRemove = clonedSection.querySelectorAll('.page-navigation, .nav-buttons, .menu-btn');
                buttonsToRemove.forEach(btn => btn.remove());
                
                // Adicionar quebra de página entre seções (exceto na última)
                if (index < allSections.length - 1) {
                    clonedSection.style.pageBreakAfter = 'always';
                }
                
                // Adicionar título da página
                const pageTitle = document.createElement('h1');
                pageTitle.style.cssText = 'color: #130F76; font-size: 24px; margin-bottom: 20px; border-bottom: 3px solid #130F76; padding-bottom: 10px;';
                
                switch(index) {
                    case 0:
                        pageTitle.textContent = 'ANÁLISE PRELIMINAR DE RISCO - APR';
                        break;
                    case 1:
                        pageTitle.textContent = 'EDIÇÃO DO DOCUMENTO';
                        break;
                    case 2:
                        pageTitle.textContent = 'HISTÓRICO DAS REVISÕES';
                        break;
                    case 3:
                        pageTitle.textContent = 'APROVAÇÃO';
                        break;
                }
                
                // Inserir título no início da seção (exceto na primeira que já tem cabeçalho)
                if (index > 0) {
                    clonedSection.insertBefore(pageTitle, clonedSection.firstChild);
                }
                
                // Adicionar HTML da seção
                allContentHTML += clonedSection.outerHTML;
                
                // Restaurar display original
                section.style.display = originalDisplay;
            }
        });
        
        // HTML completo com TODAS as páginas - DIMENSÃO DE TELA
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>APR - Análise Preliminar de Risco - Documento Completo</title>
                <style>
                    /* TODOS OS ESTILOS ORIGINAIS */
                    ${allCSS}
                    
                    /* CONFIGURAÇÕES ESPECÍFICAS PARA IMPRESSÃO - DIMENSÃO DE TELA */
                    body { 
                        margin: 0 !important;
                        padding: 20px !important;
                        background: white !important;
                        font-family: Arial, sans-serif !important;
                        color: #000 !important;
                        width: 100% !important;
                        max-width: 1200px !important; /* Largura da tela do computador */
                        margin: 0 auto !important;
                    }
                    
                    /* CONFIGURAÇÕES DE PÁGINA - LANDSCAPE PARA MANTER LARGURA */
                    @page { 
                        margin: 10mm !important;
                        size: A4 landscape !important; /* Paisagem para aproveitar largura */
                    }
                    
                    /* MANTER TODAS AS CORES E ESTILOS */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* PRESERVAR DIMENSÕES ORIGINAIS DAS TABELAS */
                    .header-table, .flex-table { 
                        border-collapse: collapse !important;
                        width: 100% !important;
                        margin-bottom: 15px !important;
                        font-size: 11px !important; /* Reduzir um pouco para caber melhor */
                    }
                    
                    .header-table td, .header-table th,
                    .flex-table td, .flex-table th { 
                        border: 1px solid #000 !important;
                        padding: 4px !important;
                        vertical-align: top !important;
                        word-wrap: break-word !important;
                    }
                    
                    /* PRESERVAR INPUTS, TEXTAREAS E CAMPOS EDITÁVEIS COMO ESTÃO */
                    input, textarea, [contenteditable] {
                        -webkit-appearance: none !important;
                        appearance: none !important;
                        border: 1px solid #000 !important;
                        background: white !important;
                        color: #000 !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        padding: 3px !important;
                        width: auto !important;
                        height: auto !important;
                    }
                    
                    /* PRESERVAR CHECKBOXES */
                    input[type="checkbox"] {
                        transform: scale(1.2) !important;
                        margin-right: 8px !important;
                    }
                    
                    /* PRESERVAR ASSINATURAS */
                    .signature-preview {
                        display: block !important;
                        max-width: 150px !important;
                        max-height: 40px !important;
                        width: auto !important;
                        height: auto !important;
                        border: 1px solid #000 !important;
                    }
                    
                    /* FORÇAR CORES DE FUNDO */
                    .green-bg { background-color: #00ff00 !important; }
                    .blue-bg { background-color: #00bfff !important; }
                    .yellow-bg { background-color: #ffff00 !important; }
                    .orange-bg { background-color: #ffa500 !important; }
                    .red-bg { background-color: #ff0000 !important; }
                    .first-row { background-color: #f0f0f0 !important; font-weight: bold !important; }
                    .second-row { background-color: #f9f9f9 !important; font-weight: bold !important; }
                    
                    /* PRESERVAR LAYOUT DOS FORMULÁRIOS */
                    .form-line {
                        display: flex !important;
                        gap: 15px !important;
                        margin-bottom: 15px !important;
                        page-break-inside: avoid !important;
                        flex-wrap: wrap !important; /* Permitir quebra de linha se necessário */
                    }
                    
                    .form-container {
                        background: white !important;
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                        width: 100% !important;
                    }
                    
                    /* QUEBRAS DE PÁGINA CONTROLADAS - APENAS 4 PÁGINAS */
                    section {
                        page-break-after: always !important;
                        min-height: 90vh !important; /* Garantir que use a página toda */
                        width: 100% !important;
                    }
                    
                    /* ÚLTIMA SEÇÃO NÃO QUEBRA PÁGINA */
                    section:last-child {
                        page-break-after: auto !important;
                    }
                    
                    .flex-table {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .approval-container {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    /* REMOVER ELEMENTOS DE NAVEGAÇÃO NA IMPRESSÃO */
                    @media print { 
                        .page-navigation,
                        .nav-buttons,
                        .menu-btn,
                        .sidebar,
                        button,
                        .btn,
                        .to-top,
                        .final-actions {
                            display: none !important;
                        }
                        
                        /* MANTER CAMPOS VISÍVEIS */
                        input, textarea, [contenteditable] {
                            border: 1px solid #000 !important;
                            background: white !important;
                            color: #000 !important;
                        }
                        
                        /* FORÇAR EXIBIÇÃO DE ASSINATURAS */
                        .signature-preview {
                            display: block !important;
                            border: 1px solid #000 !important;
                        }
                        
                        /* GARANTIR QUE SÓ TENHA 4 PÁGINAS */
                        body {
                            counter-reset: page;
                        }
                        
                        section {
                            counter-increment: page;
                        }
                        
                        /* ESCONDER QUALQUER COISA ALÉM DA 4ª PÁGINA */
                        section:nth-child(n+5) {
                            display: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${allContentHTML}
                <script>
                    window.onload = function() {
                        // Aguardar carregamento completo
                        setTimeout(function() {
                            window.print();
                        }, 2000);
                    };
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        console.log("PDF criado com TODAS as 4 páginas - dimensão de tela");
        alert('PDF com TODAS as 4 páginas criado!\n\nCONFIGURAÇÕES RECOMENDADAS:\n- Orientação: Paisagem (Landscape)\n- Margens: Mínimas\n- Ativar "Gráficos em segundo plano"\n- O documento terá exatamente 4 páginas na dimensão da tela');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar PDF: ' + error.message);
    }
}

// Função para gerar documento Word - CÓPIA VISUAL EXATA
function generateWord() {
    console.log("Iniciando geração de Word - cópia visual exata...");
    
    try {
        // Obter conteúdo da primeira seção
        const section1 = document.getElementById('section1');
        if (!section1) {
            alert('Erro: Seção do documento não encontrada.');
            return;
        }
        
        const documentContent = section1.cloneNode(true);
        
        // Capturar TODOS os estilos inline para cada elemento
        function applyInlineStyles(originalElement, clonedElement) {
            const computedStyle = window.getComputedStyle(originalElement);
            
            // Aplicar estilos mais importantes inline
            clonedElement.style.backgroundColor = computedStyle.backgroundColor;
            clonedElement.style.color = computedStyle.color;
            clonedElement.style.border = computedStyle.border;
            clonedElement.style.padding = computedStyle.padding;
            clonedElement.style.margin = computedStyle.margin;
            clonedElement.style.fontSize = computedStyle.fontSize;
            clonedElement.style.fontWeight = computedStyle.fontWeight;
            clonedElement.style.textAlign = computedStyle.textAlign;
            clonedElement.style.width = computedStyle.width;
            clonedElement.style.height = computedStyle.height;
            
            // Recursivamente aplicar aos filhos
            for (let i = 0; i < originalElement.children.length; i++) {
                if (clonedElement.children[i]) {
                    applyInlineStyles(originalElement.children[i], clonedElement.children[i]);
                }
            }
        }
        
        // Aplicar estilos inline
        applyInlineStyles(section1, documentContent);
        
        // Preservar valores dos inputs com estilos visuais
        const originalInputs = section1.querySelectorAll('input, textarea, select');
        const clonedInputs = documentContent.querySelectorAll('input, textarea, select');
        
        originalInputs.forEach((input, index) => {
            if (clonedInputs[index]) {
                const computedStyle = window.getComputedStyle(input);
                const span = document.createElement('span');
                
                // Capturar valor atual
                const currentValue = input.value || input.textContent || '';
                
                // Para checkboxes, mostrar se está marcado
                if (input.type === 'checkbox') {
                    span.textContent = input.checked ? '☑' : '☐';
                    span.style.fontSize = '16px';
                    span.style.textAlign = 'center';
                } else {
                    span.textContent = currentValue;
                }
                
                span.style.border = computedStyle.border || '1px solid #000';
                span.style.backgroundColor = computedStyle.backgroundColor || 'white';
                span.style.padding = computedStyle.padding || '3px';
                span.style.fontSize = computedStyle.fontSize;
                span.style.fontFamily = computedStyle.fontFamily;
                span.style.color = computedStyle.color || '#000';
                span.style.minHeight = '20px';
                span.style.display = 'inline-block';
                span.style.minWidth = '100px';
                span.style.whiteSpace = 'pre-wrap';
                span.style.wordWrap = 'break-word';
                
                if (clonedInputs[index].parentNode) {
                    clonedInputs[index].parentNode.replaceChild(span, clonedInputs[index]);
                }
            }
        });
        
        // Preservar elementos editáveis
        const originalEditables = section1.querySelectorAll('[contenteditable="true"]');
        const clonedEditables = documentContent.querySelectorAll('[contenteditable="true"]');
        
        originalEditables.forEach((editable, index) => {
            if (clonedEditables[index]) {
                // Capturar conteúdo atual
                const currentContent = editable.innerHTML || editable.textContent || '';
                clonedEditables[index].innerHTML = currentContent;
                clonedEditables[index].removeAttribute('contenteditable');
                
                // Manter estilos
                const computedStyle = window.getComputedStyle(editable);
                clonedEditables[index].style.border = computedStyle.border || '1px solid #000';
                clonedEditables[index].style.backgroundColor = computedStyle.backgroundColor;
                clonedEditables[index].style.padding = computedStyle.padding;
                clonedEditables[index].style.color = computedStyle.color || '#000';
            }
        });
        
        // Preservar assinaturas
        const originalSignatures = section1.querySelectorAll('.signature-preview');
        const clonedSignatures = documentContent.querySelectorAll('.signature-preview');
        
        originalSignatures.forEach((signature, index) => {
            if (clonedSignatures[index]) {
                // Verificar se há assinatura
                if (signature.src && signature.src !== '' && !signature.src.includes('data:,')) {
                    clonedSignatures[index].src = signature.src;
                    clonedSignatures[index].style.display = 'block';
                    clonedSignatures[index].style.maxHeight = '30px';
                    clonedSignatures[index].style.maxWidth = '100px';
                    clonedSignatures[index].style.border = '1px solid #000';
                    
                    console.log(`Assinatura Word ${index + 1} capturada`);
                } else {
                    // Se não há assinatura, criar um espaço em branco
                    const placeholder = document.createElement('div');
                    placeholder.style.width = '100px';
                    placeholder.style.height = '30px';
                    placeholder.style.border = '1px solid #000';
                    placeholder.style.backgroundColor = 'white';
                    placeholder.style.display = 'inline-block';
                    placeholder.innerHTML = '&nbsp;';
                    
                    if (clonedSignatures[index].parentNode) {
                        clonedSignatures[index].parentNode.replaceChild(placeholder, clonedSignatures[index]);
                    }
                }
            }
        });
        
        // Remover elementos indesejados
        const elementsToRemove = documentContent.querySelectorAll('.page-navigation, .btn, button, .nav-buttons, .sidebar, script, .menu-btn');
        elementsToRemove.forEach(el => el.remove());
        
        // Criar HTML para Word com estilos inline preservados
        let htmlContent = documentContent.outerHTML;
        
        // Criar documento Word com visual preservado
        const wordDocument = `
            <!DOCTYPE html>
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
            <head>
                <meta charset='utf-8'>
                <title>APR - Análise Preliminar de Risco</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>90</w:Zoom>
                        <w:DoNotPromptForConvert/>
                        <w:DoNotShowInsertionsAndDeletions/>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        font-size: 11pt; 
                        margin: 15pt;
                        color: black;
                        background: white;
                    }
                    
                    /* Preservar cores de fundo */
                    .green-bg { background-color: #00ff00 !important; }
                    .blue-bg { background-color: #00bfff !important; }
                    .yellow-bg { background-color: #ffff00 !important; }
                    .orange-bg { background-color: #ffa500 !important; }
                    .red-bg { background-color: #ff0000 !important; }
                    
                    /* Preservar layout das tabelas */
                    table { 
                        border-collapse: collapse; 
                        width: 100%; 
                        margin-bottom: 8pt; 
                    }
                    
                    td, th { 
                        border: 1pt solid black; 
                        padding: 3pt; 
                        vertical-align: top; 
                    }
                    
                    .first-row {
                        background-color: #f0f0f0;
                        font-weight: bold;
                    }
                    
                    .second-row {
                        background-color: #f9f9f9;
                        font-weight: bold;
                    }
                    
                    .table-title { 
                        font-weight: bold; 
                        text-align: center; 
                        background-color: #f0f0f0; 
                    }
                    
                    .identificacao-title {
                        font-size: 12pt;
                        font-weight: bold;
                        margin: 12pt 0 5pt 0;
                        border-bottom: 2pt solid #000;
                        padding-bottom: 3pt;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;
        
        // Criar blob e download
        const blob = new Blob(['\ufeff', wordDocument], { 
            type: 'application/msword' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `APR_Copia_Visual_${new Date().toISOString().split('T')[0]}.doc`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
        
        console.log("Download do Word com cópia visual iniciado");
        alert('Download do documento Word com cópia visual iniciado!');
        
    } catch (error) {
        console.error('Erro ao gerar documento Word:', error);
        alert('Erro ao gerar documento Word: ' + error.message);
    }
}