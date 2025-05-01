
    let paginaAtual = 1;
    const ITEMS_PER_PAGE = 50; // Deve corresponder ao CONFIG['ITEMS_PER_PAGE'] do backend

    function carregarSeries() {
      fetch(`${BACKEND_URL}/series/pagina?pagina=${paginaAtual}`)
        .then(response => response.json())
        .then(data => {
          const seriesContainer = document.getElementById('series-container');
          seriesContainer.innerHTML = '';

          data.series.forEach(serie => {
            const serieElement = document.createElement('div');
            serieElement.classList.add('serie-item');
            serieElement.innerHTML = `
              <img src="${serie.capa}" alt="${serie.titulo}">
              <h3>${serie.titulo}</h3>
              <p>${serie.qualidade}</p>
              <a href="player.html?id=${serie.id}">Assistir</a>
            `;
            seriesContainer.appendChild(serieElement);
          });

          atualizarPaginacao(data.series.length, data.total_paginas);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => console.error('Erro ao carregar séries:', error));
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
          carregarSeries();
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
        carregarSeries();
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      paginaAtual++;
      carregarSeries();
    });

    document.getElementById('page-input').addEventListener('change', (e) => {
      const novaPagina = parseInt(e.target.value);
      fetch(`${BACKEND_URL}/series/pagina?pagina=1`)
        .then(response => response.json())
        .then(data => {
          const totalPaginas = data.total_paginas;
          if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            paginaAtual = novaPagina;
            carregarSeries();
          } else {
            e.target.value = paginaAtual;
          }
        })
        .catch(error => {
          console.error('Erro ao validar página:', error);
          e.target.value = paginaAtual;
        });
    });

    carregarSeries();
