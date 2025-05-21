
(function() {
    // Página para redirecionar
    const AVISO_URL = 'https://www.google.ru/?hl=ru';

    
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
        // Opcional: redirecionar apenas no clique direito, se desejar
        // window.location.href = AVISO_URL;
    });

    function detectDevTools() {
        const threshold = 160; 
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
            console.log('🚫 Ferramentas de Desenvolvedor abertas detectadas (tamanho).');
            window.location.href = AVISO_URL;
        }
    }
    setInterval(detectDevTools, 1000);
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });

    console.log('🔒 Proteção contra Ferramentas de Desenvolvedor ativa.');
})();