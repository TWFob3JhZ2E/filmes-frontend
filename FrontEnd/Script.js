document.addEventListener("DOMContentLoaded", function () {
    const filmesContainer = document.querySelector(".filmes-cards");
    const seriesContainer = document.querySelector(".series-cards");
    const BACKEND_URL = "http://localhost:5000"; // Ajuste para a URL do seu backend

    // Função para carregar filmes novos
    function carregarFilmesNovos() {
        filmesContainer.innerHTML = '<p class="loading-message">Carregando filmes...</p>';
        fetch(`${BACKEND_URL}/filmes/novos`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na requisição: " + response.status);
                return response.json();
            })
            .then(filmes => {
                filmesContainer.innerHTML = "";
                if (filmes.length === 0) {
                    filmesContainer.innerHTML = '<p class="error-message">Nenhum filme disponível.</p>';
                    return;
                }
                filmes.forEach(filme => {
                    if (!filme.id || !filme.titulo || !filme.capa) {
                        console.warn("Filme com dados incompletos:", filme);
                        return;
                    }
                    const card = document.createElement("div");
                    card.classList.add("movie-card", "filme-card");
                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${filme.id}`;
                    card.innerHTML = `
                        <img src="${filme.capa}" alt="${filme.titulo}">
                        <h3>${filme.titulo}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;
                    filmesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar filmes:", error);
                filmesContainer.innerHTML = '<p class="error-message">Erro ao carregar filmes. Tente novamente.</p>';
            });
    }

    // Função para carregar séries
    function carregarSeries() {
        seriesContainer.innerHTML = '<p class="loading-message">Carregando séries...</p>';
        fetch(`${BACKEND_URL}/series`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na requisição: " + response.status);
                return response.json();
            })
            .then(series => {
                seriesContainer.innerHTML = "";
                if (series.length === 0) {
                    seriesContainer.innerHTML = '<p class="error-message">Nenhuma série disponível.</p>';
                    return;
                }
                series.forEach(serie => {
                    if (!serie.id || !serie.titulo || !serie.capa) {
                        console.warn("Série com dados incompletos:", serie);
                        return;
                    }
                    const card = document.createElement("div");
                    card.classList.add("movie-card", "serie-card");
                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${serie.id}`;
                    card.innerHTML = `
                        <img src="${serie.capa}" alt="${serie.titulo}">
                        <h3>${serie.titulo}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;
                    seriesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar séries:", error);
                seriesContainer.innerHTML = '<p class="error-message">Erro ao carregar séries. Tente novamente.</p>';
            });
    }

    // Chamar as funções
    carregarFilmesNovos();
    carregarSeries();
});