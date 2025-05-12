let paginaAtual = 1;
const ITEMS_PER_PAGE = 50;

function carregarFilmes() {
  fetch(`${BACKEND_URL}/filmes/pagina?pagina=${paginaAtual}`, {
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
      const filmesContainer = document.getElementById('filmes-container');
      filmesContainer.innerHTML = '';

      data.filmes.forEach(filme => {
        const filmeElement = document.createElement('div');
        filmeElement.classList.add('filme-item');
        filmeElement.innerHTML = `
          <img src="${filme.capa}" alt="${filme.titulo}">
          <h3>${filme.titulo}</h3>
          <p>${filme.qualidade}</p>
          <a href="player.html?id=${filme.id}">Assistir</a>
        `;
        filmesContainer.appendChild(filmeElement);
      });

      atualizarPaginacao(data.filmes.length, data.total_paginas);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error('Erro ao carregar filmes:', error));
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
      carregarFilmes();
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
    carregarFilmes();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  paginaAtual++;
  carregarFilmes();
});

document.getElementById('page-input').addEventListener('change', (e) => {
  const novaPagina = parseInt(e.target.value);
  fetch(`${BACKEND_URL}/filmes/pagina?pagina=1`, {
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
        carregarFilmes();
      } else {
        e.target.value = paginaAtual;
      }
    })
    .catch(error => {
      console.error('Erro ao validar página:', error);
      e.target.value = paginaAtual;
    });
});

carregarFilmes();