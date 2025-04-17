document.addEventListener("DOMContentLoaded", function () {
    const destaquesContainer = document.querySelector(".destaques-cards");

    // Função para carregar filmes novos
    function carregarFilmesNovos() {
        fetch(`${BACKEND_URL}/filmes/novos`)
            .then(response => response.json())
            .then(filmes => {
                filmes.forEach(filme => {
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
            .catch(error => console.error('Erro ao carregar filmes novos:', error));
    }

    // Função para carregar séries (opcional)
    function carregarSeries() {
        fetch(`${BACKEND_URL}/series`)
            .then(response => response.json())
            .then(series => {
                series.forEach(serie => {
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
            .catch(error => console.error('Erro ao carregar séries:', error));
    }

    // Chamar funções ao carregar a página
    carregarFilmesNovos();
    // carregarSeries(); // Descomente se quiser exibir séries também
});
