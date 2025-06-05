const ITEMS_PER_PAGE = 50;

let paginaAtual = 1;

function carregarAnimes() {
  const animesContainer = document.getElementById('animes-container');
  const loader = document.getElementById('loader');
  animesContainer.innerHTML = '';
  loader.classList.remove('hidden');

  fetch(`${BACKEND_URL}/animes/pagina?pagina=${paginaAtual}`, {
    headers: {
      'X-API-Key': API_KEY
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.resultados && data.resultados.length > 0) {
        data.resultados.forEach(anime => {
          const animeItem = document.createElement('div');
          animeItem.classList.add('anime-item');
          animeItem.innerHTML = `
            <div class="image-container">
              <img src="${anime.capa || 'https://via.placeholder.com/200x300?text=Sem+Imagem'}" alt="${anime.titulo}">
              <div class="overlay">
                <h3>${anime.titulo}</h3>
                <p>${anime.descricao ? anime.descricao.substring(0, 100) + '...' : 'Sem descrição'}</p>
              </div>
            </div>
            <a href="/PAGES/player.html?id=${anime.id}">Assista Agora</a>
          `;
          animesContainer.appendChild(animeItem);
        });
      } else {
        animesContainer.innerHTML = '<p>Nenhum anime encontrado.</p>';
      }

      atualizarPaginacao(data.resultados.length, data.total_paginas);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      console.error('Erro ao carregar animes:', error);
      animesContainer.innerHTML = `<p>Erro ao carregar animes: ${error.message}. <button onclick="carregarAnimes()">Tentar novamente</button></p>`;
    })
    .finally(() => {
      loader.classList.add('hidden');
    });
}

function atualizarPaginacao(tamanhoPagina, totalPaginas) {
  const pageNumbersContainer = document.getElementById('page-numbers');
  pageNumbersContainer.innerHTML = '';

  const maxPaginasVisiveis = 5;
  let inicio = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
  let fim = Math.min(totalPaginas, inicio + maxPaginasVisiveis - 1);

  if (fim - inicio + 1 < maxPaginasVisiveis) {
    inicio = Math.max(1, fim - maxPaginasVisiveis + 1);
  }

  for (let i = inicio; i <= fim; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-btn');
    pageButton.setAttribute('aria-label', `Ir para página ${i}`);
    if (i === paginaAtual) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      paginaAtual = i;
      carregarAnimes();
    });
    pageNumbersContainer.appendChild(pageButton);
  }

  document.getElementById('prev-btn').disabled = paginaAtual === 1;
  document.getElementById('next-btn').disabled = tamanhoPagina < ITEMS_PER_PAGE || paginaAtual === totalPaginas;
  document.getElementById('page-input').value = paginaAtual;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    carregarAnimes();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  paginaAtual++;
  carregarAnimes();
});

document.getElementById('page-input').addEventListener('change', (e) => {
  const novaPagina = parseInt(e.target.value);
  fetch(`${BACKEND_URL}/animes/pagina?pagina=1`, {
    headers: {
      'X-API-Key': API_KEY
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const totalPaginas = data.total_paginas;
      if (novaPagina >= 1 && novaPagina <= totalPaginas) {
        paginaAtual = novaPagina;
        carregarAnimes();
      } else {
        e.target.value = paginaAtual;
      }
    })
    .catch(error => {
      console.error('Erro ao validar página:', error);
      e.target.value = paginaAtual;
    });
});

document.addEventListener('DOMContentLoaded', () => {
  carregarAnimes();
});