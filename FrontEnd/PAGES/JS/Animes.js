const ITEMS_PER_PAGE = 50;

let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadAnimes(currentPage);
    setupPagination();
});

async function loadAnimes(page) {
    const container = document.getElementById('animes-container');
    const loader = document.getElementById('loader');
    container.innerHTML = '';
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}?pagina=${page}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }

        const data = await response.json();
        totalPages = data.total_paginas || 1;
        currentPage = data.pagina_atual || 1;

        if (data.resultados && data.resultados.length > 0) {
            data.resultados.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.classList.add('anime-item');
                animeItem.innerHTML = `
                    <img src="${anime.capa || 'https://via.placeholder.com/200x300?text=Sem+Imagem'}" alt="${anime.titulo}">
                    <div class="overlay">
                        <h3>${anime.titulo}</h3>
                        <p>${anime.descricao ? anime.descricao.substring(0, 100) + '...' : 'Sem descrição'}</p>
                    </div>
                    <a href="/PAGES/detalhes.html?id=${anime.id}&tipo=anime">Ver Detalhes</a>
                `;
                container.appendChild(animeItem);
            });
        } else {
            container.innerHTML = '<p>Nenhum anime encontrado.</p>';
        }

        updatePagination();
    } catch (error) {
        console.error('Erro ao carregar animes:', error);
        container.innerHTML = '<p>Erro ao carregar animes. Tente novamente mais tarde.</p>';
    } finally {
        loader.classList.add('hidden');
    }
}

function setupPagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInput = document.getElementById('page-input');

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadAnimes(currentPage);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadAnimes(currentPage);
        }
    });

    pageInput.addEventListener('change', () => {
        let page = parseInt(pageInput.value);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            loadAnimes(currentPage);
        } else {
            pageInput.value = currentPage;
            alert('Página inválida!');
        }
    });
}

function updatePagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            loadAnimes(currentPage);
        });
        pageNumbers.appendChild(btn);
    }
}