document.addEventListener("DOMContentLoaded", function () {
    const destaquesContainer = document.querySelector(".destaques-cards");
    let csrfToken = null;

    // Coloque a MESMA API_KEY que tá no Render
    const API_KEY = "sua-se-cha2ve-sexo09mineecraft-de-api-12345";

    // Função para carregar o token CSRF
    function carregarCsrfToken() {
        return fetch(CSRF_TOKEN_ENDPOINT, {
            headers: {
                'X-API-Key': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar token CSRF');
                }
                return response.json();
            })
            .then(data => {
                csrfToken = data.csrf_token;
                console.log('Token CSRF carregado:', csrfToken);
            })
            .catch(error => {
                console.error('Erro ao carregar token CSRF:', error);
            });
    }

    // Função para fazer requisições POST com CSRF token e API key
    function makePostRequest(endpoint, data) {
        if (!csrfToken) {
            console.error('Token CSRF não disponível. Carregue o token primeiro.');
            return Promise.reject('Token CSRF não disponível');
        }

        return fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'X-API-Key': API_KEY
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição POST');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro na requisição POST:', error);
                throw error;
            });
    }

    // Função para carregar filmes novos
    function carregarFilmesNovos() {
        fetch(`${BACKEND_URL}/filmes/novos`, {
            headers: {
                'X-API-Key': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar filmes novos');
                }
                return response.json();
            })
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

    // Função para carregar séries
    function carregarSeries() {
        fetch(`${BACKEND_URL}/series`, {
            headers: {
                'X-API-Key': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar séries');
                }
                return response.json();
            })
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

    // Carregar token CSRF e depois os filmes/séries
    carregarCsrfToken().then(() => {
        carregarFilmesNovos();
        carregarSeries();
    });
});