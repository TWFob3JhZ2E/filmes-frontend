// Bloqueia o botão direito do mouse
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

// Bloqueia F12 e atalhos comuns
document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  if (event.key === "F12" ||
      (event.ctrlKey && event.shiftKey && (key === "i" || key === "j" || key === "c")) ||
      (event.ctrlKey && key === "u")) {
    event.preventDefault();
  }
});

// Detecta o uso do DevTools e reinicia + redireciona
let redirecionado = false;

setInterval(function () {
  const antes = new Date().getTime();
  debugger;
  const depois = new Date().getTime();

  if (!redirecionado && depois - antes > 100) {
    redirecionado = true;

    // Recarrega a página
    location.reload();

    // Após pequeno atraso, redireciona
    setTimeout(() => {
      window.location.href = "http://www.google.com/"; // Substitua pela URL desejada
    }, 500);
  }
}, 1000);
