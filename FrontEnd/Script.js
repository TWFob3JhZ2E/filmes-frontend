document.addEventListener("DOMContentLoaded", function () {
    const destaquesContainer = document.querySelector(".destaques-cards");
    let csrfToken = null; // Variable to store the CSRF token

    // Function to fetch the CSRF token
    function fetchCsrfToken() {
        fetch(`${BACKEND_URL}/get-csrf-token`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch CSRF token');
                }
                return response.json();
            })
            .then(data => {
                csrfToken = data.csrf_token; // Store the token
                console.log('CSRF token fetched:', csrfToken); // Log for debugging
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }

    // Function to load new movies
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

    // Function to load series (optional)
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

    // Call functions when the page loads
    fetchCsrfToken(); // Fetch the CSRF token first
    carregarFilmesNovos();
    carregarSeries();
});