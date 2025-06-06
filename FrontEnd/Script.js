document.addEventListener("DOMContentLoaded", function () {
    // Verificar contêineres
    const filmesContainer = document.querySelector("#filmes-container");
    const seriesContainer = document.querySelector("#series-container");
    const animesContainer = document.querySelector("#animes-container");
    let csrfToken = null;

    console.log('🌐 Inicializando Script.js');
    console.log('📍 Filmes Container:', filmesContainer ? 'Encontrado' : 'Não encontrado');
    console.log('📍 Séries Container:', seriesContainer ? 'Encontrado' : 'Não encontrado');
    console.log('📍 Animes Container:', animesContainer ? 'Encontrado' : 'Não encontrado');
    console.log('🔗 BACKEND_URL:', typeof BACKEND_URL !== 'undefined' ? BACKEND_URL : 'Indefinido');
    console.log('🔑 API_KEY:', typeof API_KEY !== 'undefined' ? API_KEY : 'Indefinido');

    // Verificar se contêineres existem
    if (!filmesContainer || !seriesContainer || !animesContainer) {
        console.error('❌ Um ou mais contêineres não foram encontrados. Verifique o index.html.');
        return;
    }

    // Função para carregar o token CSRF
    function carregarCsrfToken() {
        if (typeof CSRF_TOKEN_ENDPOINT === 'undefined') {
            console.error('❌ CSRF_TOKEN_ENDPOINT indefinido. Verifique Config.js.');
            return Promise.reject('CSRF_TOKEN_ENDPOINT indefinido');
        }
        console.log('🔍 Carregando token CSRF de:', CSRF_TOKEN_ENDPOINT);
        return fetch(CSRF_TOKEN_ENDPOINT, {
            headers: {
                'X-API-Key': API_KEY || ''
            }
        })
            .then(response => {
                console.log('📡 Resposta do CSRF:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar token CSRF: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                csrfToken = data.csrf_token;
                console.log('✅ Token CSRF carregado:', csrfToken);
            })
            .catch(error => {
                console.error('❌ Erro ao carregar token CSRF:', error);
            });
    }

    // Função para fazer requisições POST com CSRF token e API key
    function makePostRequest(endpoint, data) {
        if (!csrfToken) {
            console.error('❌ Token CSRF não disponível. Carregue o token primeiro.');
            return Promise.reject('Token CSRF não disponível');
        }

        return fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'X-API-Key': API_KEY || ''
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição POST: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('❌ Erro na requisição POST:', error);
                throw error;
            });
    }

    // Função para carregar filmes novos
    function carregarFilmesNovos() {
        console.log('🔍 Carregando filmes novos de:', `${BACKEND_URL}/filmes/novos`);
        fetch(`${BACKEND_URL}/filmes/novos`, {
            headers: {
                'X-API-Key': API_KEY || ''
            }
        })
            .then(response => {
                console.log('📡 Resposta de /filmes/novos:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(filmes => {
                console.log('📥 Filmes recebidos:', filmes);
                if (!filmes || filmes.length === 0) {
                    console.warn('⚠️ Nenhum filme novo encontrado.');
                    filmesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Nenhum filme disponível no momento.</p>';
                    return;
                }
                filmes.forEach(filme => {
                    const card = document.createElement("div");
                    card.classList.add("movie-card");

                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${filme.id}`;

                    card.innerHTML = `
                        <img src="${filme.capa || 'https://via.placeholder.com/200x300?text=Filme'}" alt="${filme.titulo || 'Sem título'}">
                        <h3>${filme.titulo || 'Filme sem título'}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;

                    filmesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('❌ Erro ao carregar filmes novos:', error);
                filmesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro ao carregar filmes.</p>';
            });
    }

    // Função para carregar séries
    function carregarSeries() {
        console.log('🔍 Carregando séries de:', `${BACKEND_URL}/series`);
        fetch(`${BACKEND_URL}/series`, {
            headers: {
                'X-API-Key': API_KEY || ''
            }
        })
            .then(response => {
                console.log('📡 Resposta de /series:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(series => {
                console.log('📥 Séries recebidas:', series);
                if (!series || series.length === 0) {
                    console.warn('⚠️ Nenhuma série encontrada.');
                    seriesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Nenhuma série disponível no momento.</p>';
                    return;
                }
                series.forEach(serie => {
                    const card = document.createElement("div");
                    card.classList.add("movie-card");

                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${serie.id}`;

                    card.innerHTML = `
                        <img src="${serie.capa || 'https://via.placeholder.com/200x300?text=Série'}" alt="${serie.titulo || 'Sem título'}">
                        <h3>${serie.titulo || 'Série sem título'}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;

                    seriesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('❌ Erro ao carregar séries:', error);
                seriesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro ao carregar séries.</p>';
            });
    }

    // Função para carregar animes novos
    function carregarAnimesNovos() {
        console.log('🔍 Carregando animes novos de:', `${BACKEND_URL}/animes/novos`);
        fetch(`${BACKEND_URL}/animes/novos`, {
            headers: {
                'X-API-Key': API_KEY || ''
            }
        })
            .then(response => {
                console.log('📡 Resposta de /animes/novos:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(animes => {
                console.log('📥 Animes recebidos:', animes);
                if (!animes || animes.length === 0) {
                    console.warn('⚠️ Nenhum anime novo encontrado.');
                    animesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Nenhum anime disponível no momento.</p>';
                    return;
                }
                animes.forEach(anime => {
                    const card = document.createElement("div");
                    card.classList.add("movie-card");

                    const playerURL = `${window.location.origin}/PAGES/player.html?id=${anime.id}`;

                    card.innerHTML = `
                        <img src="${anime.capa || 'https://via.placeholder.com/200x300?text=Anime'}" alt="${anime.titulo || 'Sem título'}">
                        <h3>${anime.titulo || 'Anime sem título'}</h3>
                        <a href="${playerURL}" class="assistir-btn">Assistir</a>
                    `;

                    animesContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('❌ Erro ao carregar animes novos:', error);
                animesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro ao carregar animes.</p>';
            });
    }

    // Verificar inicialização
    if (typeof BACKEND_URL === 'undefined' || typeof API_KEY === 'undefined') {
        console.error('❌ BACKEND_URL ou API_KEY indefinidos. Verifique Config.js.');
        filmesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro de configuração. Contate o suporte.</p>';
        seriesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro de configuração. Contate o suporte.</p>';
        animesContainer.innerHTML = '<p style="color: #fff; text-align: center;">Erro de configuração. Contate o suporte.</p>';
        return;
    }

    // Carregar token CSRF e depois os filmes, séries e animes
    console.log('🌐 Iniciando carregamento com BACKEND_URL:', BACKEND_URL, 'e API_KEY:', API_KEY);
    carregarCsrfToken().then(() => {
        carregarFilmesNovos();
        carregarSeries();
        carregarAnimesNovos();
    }).catch(error => {
        console.error('❌ Erro durante inicialização:', error);
    });
});