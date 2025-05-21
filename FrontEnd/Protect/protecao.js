
(function() {
    const AVISO_URL = 'https://www.google.ru/?hl=ru';

    // Bloquear atalhos de teclado (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            console.log('🚫 Tentativa de abrir Ferramentas de Desenvolvedor detectada (teclado).');
            window.location.href = AVISO_URL;
        }
    });

    // Bloquear menu de contexto (clique direito)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        console.log('🚫 Clique direito bloqueado.');
        window.location.href = AVISO_URL;
    });

    // Impedir seleção de texto (opcional, para dificultar cópia)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });

    // Detectar DevTools com debugger trap
    function detectDevTools() {
        let startTime = performance.now();
        debugger; // Pausa se DevTools estiver aberto com breakpoints
        let endTime = performance.now();
        let timeDiff = endTime - startTime;

        // Se o tempo de execução for muito longo (>50ms), DevTools provavelmente está aberto
        if (timeDiff > 50) {
            console.log('🚫 Ferramentas de Desenvolvedor abertas detectadas (debugger trap).');
            window.location.href = AVISO_URL;
        }
    }

    // Verificar periodicamente
    setInterval(detectDevTools, 1000);

    // Detecção adicional por tamanho da janela (mantida como backup)
    function detectDevToolsBySize() {
        const threshold = 160; // Diferença mínima para detectar DevTools
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            console.log('🚫 Ferramentas de Desenvolvedor abertas detectadas (tamanho).');
            window.location.href = AVISO_URL;
        }
    }

    setInterval(detectDevToolsBySize, 1000);

    console.log('🔒 Proteção contra Ferramentas de Desenvolvedor ativa.');
})();