document.addEventListener("DOMContentLoaded", function () {
    const destaquesContainer = document.querySelector(".destaques-cards");
    const BACKEND_URL = "http://localhost:5001"; // Ajuste se necessário

    // Verifica se o container existe
    if (!destaquesContainer) {
        console.error("Container .destaques-cards não encontrado no HTML!");
        return;
    }

    // Função para carregar filmes novos
    function carregarFilmesNovos() {
        fetch(`${BACKEND_URL}/filmes/novos`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(filmes => {
                console.log("Filmes recebidos:", filmes); // Log para depuração
                if (!Array.isArray(filmes) || filmes.length === 0) {
                    console.warn("Nenhum filme novo recebido ou formato inválido.");
                    return;
                }
                filmes.forEach(filme => {
                    if (!filme.id || !filme.titulo || !filme.capa) {
                        console.warn("Filme com dados incompletos:", filme);
                        return;
                    }
                    const card = document.createElement("div");
                    card.classList.add("movie-card");
                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${filme.id}`;
                    card.innerHTML = `
                        <img src="${filme.capa}" alt="${filme.titulo}">
                        <h3>${filme.titulo}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;
                    destaquesContainer.appendChild(card);
                });
            })
            .catch(error => console.error("Erro ao carregar filmes novos:", error));
    }

    // Função para carregar séries
    function carregarSeries() {
        fetch(`${BACKEND_URL}/series?wait=true`) // Adiciona wait=true para forçar atualização
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(series => {
                console.log("Séries recebidas:", series); // Log para depuração
                if (!Array.isArray(series) || series.length === 0) {
                    console.warn("Nenhuma série recebida ou formato inválido.");
                    return;
                }
                series.forEach(serie => {
                    if (!serie.id || !serie.titulo || !serie.capa) {
                        console.warn("Série com dados incompletos:", serie);
                        return;
                    }
                    const card = document.createElement("div");
                    card.classList.add("movie-card");
                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${serie.id}`;
                    card.innerHTML = `
                        <img src="${serie.capa}" alt="${serie.titulo}">
                        <h3>${serie.titulo}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;
                    destaquesContainer.appendChild(card);
                });
            })
            .catch(error => console.error("Erro ao carregar séries:", error));
    }

    // Chamar funções ao carregar a página
    carregarFilmesNovos();
    carregarSeries();
});