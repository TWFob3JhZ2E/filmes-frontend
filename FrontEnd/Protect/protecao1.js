(function() {
    const WARNING_URL = '/aviso.html'; // Custom warning page

    // Keyboard shortcut blocking
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            showWarning('Tentativa de abrir Ferramentas de Desenvolvedor detectada.');
        }
    });

    // Selective context menu blocking
    document.addEventListener('contextmenu', function(e) {
        if (!e.target.closest('a, button, .ad-container')) {
            e.preventDefault();
            showWarning('Clique direito restrito fora de links ou anúncios.');
        }
    });

    // Selective text selection blocking
    document.addEventListener('selectstart', function(e) {
        if (!e.target.closest('nav, footer') && !navigator.userAgent.includes('ScreenReader')) {
            e.preventDefault();
        }
    });

    // Warning modal
    function showWarning(message) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 20%; left: 50%; transform: translateX(-50%); background: #1c1c1c; color: #fff; padding: 1rem; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
                <p>${message}</p>
                <button style="background: #e50914; color: #fff; padding: 0.5rem 1rem; border: none; border-radius: 4px; margin-top: 1rem;" onclick="this.parentElement.remove()">Fechar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // DevTools detection (debugger trap)
    function detectDevTools() {
        let startTime = performance.now();
        debugger;
        let endTime = performance.now();
        if (endTime - startTime > 100) {
            showWarning('Ferramentas de Desenvolvedor abertas detectadas.');
        }
    }

    // Debounced DevTools detection
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    setInterval(debounce(detectDevTools, 2000), 2000);

    console.log('🔒 Proteção contra Ferramentas de Desenvolvedor ativa.');
})();