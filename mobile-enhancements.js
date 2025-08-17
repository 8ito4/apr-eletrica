/**
 * Mobile Enhancements for APR Application
 * Melhorias específicas para dispositivos móveis
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detectar se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouch) {
        initMobileEnhancements();
    }
});

function initMobileEnhancements() {
    // Melhorar experiência de toque para células editáveis
    enhanceTouchExperience();
    
    // Otimizar modal de assinatura para mobile
    optimizeSignatureModal();
    
    // Melhorar navegação por toque
    enhanceTouchNavigation();
    
    // Prevenir zoom indesejado
    preventUnwantedZoom();
    
    // Melhorar scrolling suave
    enhanceSmoothScrolling();
    
    // Otimizar performance para mobile
    optimizeMobilePerformance();
}

function enhanceTouchExperience() {
    // Melhorar feedback visual para células editáveis
    const editableCells = document.querySelectorAll('.editable-cell, .editable-field');
    
    editableCells.forEach(cell => {
        // Adicionar feedback de toque
        cell.addEventListener('touchstart', function(e) {
            this.style.backgroundColor = '#e6f2ff';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.1s ease';
        });
        
        cell.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.transform = '';
            }, 100);
        });
        
        // Melhorar seleção de texto em mobile
        cell.addEventListener('touchstart', function(e) {
            if (this.contentEditable === 'true' || this.tagName === 'INPUT' || this.tagName === 'TEXTAREA') {
                // Permitir seleção mais fácil em mobile
                setTimeout(() => {
                    if (this.focus) this.focus();
                    if (this.select && this.tagName === 'INPUT') this.select();
                }, 50);
            }
        });
    });
}

function optimizeSignatureModal() {
    const signatureModal = document.getElementById('signature-modal');
    if (!signatureModal) return;
    
    // Melhorar área de toque do canvas de assinatura
    const canvas = signatureModal.querySelector('canvas');
    if (canvas) {
        // Ajustar tamanho do canvas para mobile
        function resizeCanvas() {
            const modalWidth = signatureModal.offsetWidth;
            if (modalWidth < 400) {
                canvas.style.height = '120px';
            } else {
                canvas.style.height = '150px';
            }
        }
        
        // Redimensionar quando modal for aberto
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style' && signatureModal.style.display !== 'none') {
                    setTimeout(resizeCanvas, 100);
                }
            });
        });
        
        observer.observe(signatureModal, { attributes: true });
        
        // Prevenir scroll durante assinatura
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    }
}

function enhanceTouchNavigation() {
    // Melhorar botões de navegação para touch
    const navButtons = document.querySelectorAll('.nav-buttons button, .menu-btn, .close-menu, .page-nav-btn, .final-btn');
    
    navButtons.forEach(button => {
        // Adicionar feedback visual
        button.addEventListener('touchstart', function(e) {
            this.style.backgroundColor = 'rgba(255,255,255,0.2)';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'all 0.1s ease';
        });
        
        button.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.transform = '';
            }, 100);
        });
    });
    
    // Melhorar swipe para navegação entre páginas
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Verificar se é um swipe horizontal
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            
            if (diffX > 0 && nextBtn && !nextBtn.disabled) {
                // Swipe para esquerda - próxima página
                nextBtn.click();
            } else if (diffX < 0 && prevBtn && !prevBtn.disabled) {
                // Swipe para direita - página anterior
                prevBtn.click();
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

function preventUnwantedZoom() {
    // Prevenir zoom duplo toque em elementos específicos
    const preventZoomElements = document.querySelectorAll('table, .flex-table, .header-table');
    
    preventZoomElements.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.target.click();
        });
    });
    
    // Permitir zoom apenas quando necessário
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function enhanceSmoothScrolling() {
    // Melhorar scroll suave em mobile
    if (CSS.supports('scroll-behavior', 'smooth')) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Otimizar scroll para tabelas longas
    const tables = document.querySelectorAll('.flex-table');
    tables.forEach(table => {
        table.style.overflowX = 'auto';
        table.style.webkitOverflowScrolling = 'touch';
    });
}

function optimizeMobilePerformance() {
    // Debounce para eventos de resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reajustar elementos quando orientação mudar
            adjustForOrientation();
        }, 250);
    });
    
    // Otimizar renderização de tabelas grandes
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = 'visible';
            }
        });
    }, {
        threshold: 0.1
    });
    
    const tables = document.querySelectorAll('.flex-table');
    tables.forEach(table => {
        observer.observe(table);
    });
}

function adjustForOrientation() {
    // Ajustar layout baseado na orientação
    const isLandscape = window.innerWidth > window.innerHeight;
    const tables = document.querySelectorAll('.flex-table');
    
    tables.forEach(table => {
        if (isLandscape && window.innerWidth < 768) {
            // Modo landscape em mobile - compactar mais
            table.style.fontSize = '10px';
        } else {
            // Modo portrait ou desktop - tamanho normal
            table.style.fontSize = '';
        }
    });
}

// Adicionar classe CSS para indicar que é mobile
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('mobile-device');
}

// Adicionar classe para dispositivos touch
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
}

// Melhorar experiência de digitação em mobile
function enhanceMobileInput() {
    const inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
    
    inputs.forEach(input => {
        // Prevenir zoom ao focar em input
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    const originalContent = viewport.getAttribute('content');
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    
                    input.addEventListener('blur', function() {
                        viewport.setAttribute('content', originalContent);
                    }, { once: true });
                }
            }
        });
    });
}

// Inicializar melhorias de input quando DOM carregar
document.addEventListener('DOMContentLoaded', enhanceMobileInput); 