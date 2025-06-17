(function () {
  "use strict";

  // === CONFIG ===
  const REDIRECT_URL = "https://www.google.com/";
  const BLOCK_MESSAGE = `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <h1>Inspeção bloqueada</h1>
      <p>Você será redirecionado em instantes...</p>
    </div>
  `;

  let bloqueado = false;

  // === Função para bloquear página ===
  function bloquearPagina() {
    if (bloqueado) return;
    bloqueado = true;

    document.body.innerHTML = BLOCK_MESSAGE;
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 2000);
  }

  // === Bloquear clique direito ===
  document.addEventListener("contextmenu", e => e.preventDefault(), { passive: false });

  // === Bloquear teclas ===
  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
      (e.ctrlKey && key === "u")
    ) {
      e.preventDefault();
    }
  }, { passive: false });

  // === Detector de debugger por tempo ===
  setInterval(() => {
    const t0 = performance.now();
    debugger;
    const t1 = performance.now();
    if (t1 - t0 > 100) {
      bloquearPagina();
    }
  }, 1000);

  // === Detector de console aberto por tamanho ===
  const detectConsole = () => {
    const threshold = 160; // altura mínima para considerar console aberto
    if (window.outerHeight - window.innerHeight > threshold) {
      bloquearPagina();
    }
  };
  setInterval(detectConsole, 1000);
  window.onresize = detectConsole;

  // === Detector por console.log ===
  // Tentativa de chamar console.log com getter - ainda burlarável, mas atrapalha leigos
  const detectLog = () => {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        bloquearPagina();
      }
    });
    console.log('%c', element);
  };
  setInterval(detectLog, 2000);

})();
