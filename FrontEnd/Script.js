// URL da API do Backend
const BACKEND_URL = "https://filmes-flask.onrender.com";
const API_KEY = "aW9!7sd9e8e98jzK$p3Rt6yU*IUHhusdhibH2nCvE8q"; // Chave API

document.addEventListener("DOMContentLoaded", function () {
    const destaquesContainer = document.querySelector(".destaques-cards");

    // Função para carregar filmes novos
    async function carregarFilmesNovos() {
        console.log('Iniciando carregamento de filmes...');
        try {
            const response = await fetch(`${BACKEND_URL}/filmes/novos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,  // Enviar a chave API
                    'Content-Type': 'application/json'  // Definir tipo de conteúdo
                }
            });

            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error('Falha ao obter filmes. Código de erro: ' + response.status);
            }

            // Converter resposta para JSON
            const filmes = await response.json();
            console.log(filmes);  // Verifique os dados no console

            // Exibir filmes na página
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
        } catch (error) {
            console.error('Erro ao carregar filmes novos:', error);
            alert("Erro ao carregar filmes. Por favor, tente novamente mais tarde.");
        }
    }

    // Função para carregar séries
    async function carregarSeries() {
        console.log('Iniciando carregamento de séries...');
        try {
            const response = await fetch(`${BACKEND_URL}/series`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,  // Enviar a chave API
                    'Content-Type': 'application/json'  // Definir tipo de conteúdo
                }
            });

            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error('Falha ao obter séries. Código de erro: ' + response.status);
            }

            // Converter resposta para JSON
            const series = await response.json();

            // Exibir séries na página
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
        } catch (error) {
            console.error('Erro ao carregar séries:', error);
            alert("Erro ao carregar séries. Por favor, tente novamente mais tarde.");
        }
    }

    // Chamar funções ao carregar a página
    carregarFilmesNovos();
    carregarSeries();
});
