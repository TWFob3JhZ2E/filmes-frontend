/**
 * Cria uma função debounced que atrasa a execução até que o tempo de espera passe sem novas chamadas.
 * @param {Function} func - Função a ser debounced.
 * @param {number} wait - Tempo de espera em milissegundos.
 * @returns {Function} - Função debounced.
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Busca sugestões de filmes, séries ou animes com base no texto digitado.
 * @param {string} texto - Texto de busca.
 */
async function buscarSugestoes(texto) {
    const sugestoesDiv = document.getElementById('sugestoes');
    sugestoesDiv.innerHTML = '';
    sugestoesDiv.style.display = 'none';

    if (!texto || texto.length < 2) {
        return;
    }

    try {
        console.log("🔍 Buscando sugestões para:", texto);
        console.log("🌐 BACKEND_URL:", BACKEND_URL);
        console.log("🔑 API_KEY:", API_KEY);

        // Verifica cache primeiro
        const cacheKey = `search_${texto.toLowerCase()}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < 3600000) { // Cache válido por 1 hora
                console.log("📦 Usando dados do cache:", data);
                exibirResultados(data.resultados);
                return;
            }
        }

        const res = await fetch(`${BACKEND_URL}/buscar?q=${encodeURIComponent(texto)}&pagina=1&tipos=filme,serie,anime`, {
            headers: { 'X-API-Key': API_KEY }
        });

        console.log("📡 Status da resposta:", res.status, res.statusText);

        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
        }

        const dados = await res.json();
        console.log("📥 Resposta do backend:", dados);

        // Verificar se há erro ou resultados vazios
        if (dados.erro) {
            sugestoesDiv.innerHTML = `<p style='padding: 10px;'>${dados.erro}</p>`;
            sugestoesDiv.style.display = 'block';
            return;
        }

        if (!dados.resultados || !Array.isArray(dados.resultados) || dados.resultados.length === 0) {
            sugestoesDiv.innerHTML = "<p style='padding: 10px;'>Nenhum resultado encontrado.</p>";
            sugestoesDiv.style.display = 'block';
            return;
        }

        // Remover duplicatas com base no ID
        const resultadosUnicos = [];
        const idsVistos = new Set();
        dados.resultados.forEach(item => {
            if (!idsVistos.has(item.id)) {
                resultadosUnicos.push(item);
                idsVistos.add(item.id);
            }
        });

        // Armazenar no cache
        localStorage.setItem(cacheKey, JSON.stringify({
            data: { resultados: resultadosUnicos },
            timestamp: Date.now()
        }));

        exibirResultados(resultadosUnicos);
    } catch (error) {
        console.error('❌ Erro detalhado ao buscar sugestões:', error);
        console.error('🔗 URL da requisição:', `${BACKEND_URL}/buscar?q=${encodeURIComponent(texto)}&pagina=1&tipos=filme,serie,anime`);
        sugestoesDiv.innerHTML = "<p style='padding: 10px; color: red;'>Erro ao buscar dados: Verifique o console para detalhes.</p>";
        sugestoesDiv.style.display = 'block';
    }
}

/**
 * Exibe os resultados da busca na interface.
 * @param {Array} resultados - Lista de resultados da busca.
 */
function exibirResultados(resultados) {
    const sugestoesDiv = document.getElementById('sugestoes');
    sugestoesDiv.innerHTML = '';

    // Adicionar filtros por tipo
    const filtrosDiv = document.createElement('div');
    filtrosDiv.className = 'filtros';
    filtrosDiv.style.marginBottom = '10px';
    const tipos = ['Todos', 'Filme', 'Série', 'Anime'];
    tipos.forEach(tipo => {
        const botao = document.createElement('button');
        botao.textContent = tipo;
        botao.className = tipo === 'Todos' ? 'filtro ativo' : 'filtro';
        botao.onclick = () => filtrarResultados(tipo.toLowerCase(), resultados);
        filtrosDiv.appendChild(botao);
    });
    sugestoesDiv.appendChild(filtrosDiv);

    // Exibir até 5 resultados iniciais
    resultados.slice(0, 5).forEach(item => {
        adicionarItemSugestao(item);
    });

    sugestoesDiv.style.display = 'block';
}

/**
 * Filtra e exibe resultados com base no tipo selecionado.
 * @param {string} tipo - Tipo de conteúdo ('todos', 'filme', 'serie', 'anime').
 * @param {Array} resultados - Lista de resultados da busca.
 */
function filtrarResultados(tipo, resultados) {
    const sugestoesDiv = document.getElementById('sugestoes');
    const filtros = sugestoesDiv.querySelectorAll('.filtro');
    filtros.forEach(f => f.classList.remove('ativo'));
    filtros.forEach(f => {
        if (f.textContent.toLowerCase() === tipo) f.classList.add('ativo');
    });

    const resultadosFiltrados = tipo === 'todos' 
        ? resultados 
        : resultados.filter(item => item.tipo.toLowerCase() === tipo);

    const containerResultados = sugestoesDiv.querySelector('.resultados') || document.createElement('div');
    containerResultados.className = 'resultados';
    containerResultados.innerHTML = '';

    if (resultadosFiltrados.length === 0) {
        containerResultados.innerHTML = "<p style='padding: 10px;'>Nenhum resultado encontrado para este tipo.</p>";
    } else {
        resultadosFiltrados.slice(0, 5).forEach(item => {
            adicionarItemSugestao(item, containerResultados);
        });
    }

    if (!sugestoesDiv.querySelector('.resultados')) {
        sugestoesDiv.appendChild(containerResultados);
    }
}

/**
 * Adiciona um item de sugestão à interface.
 * @param {Object} item - Item da busca (filme, série ou anime).
 * @param {HTMLElement} container - Container onde o item será adicionado.
 */
function adicionarItemSugestao(item, container = document.getElementById('sugestoes')) {
    const div = document.createElement('div');
    div.className = 'sugestao-item';

    const img = document.createElement('img');
    img.src = item.capa || 'https://via.placeholder.com/40x60?text=?';
    img.alt = item.titulo;
    img.style.width = '40px';
    img.style.height = 'auto';
    img.style.marginRight = '10px';
    img.loading = 'lazy';

    const span = document.createElement('span');
    const tipo = item.tipo === 'filme' ? 'Filme' : item.tipo === 'serie' ? 'Série' : 'Anime';
    span.textContent = `${item.titulo} (${tipo})`;

    div.appendChild(img);
    div.appendChild(span);

    div.onclick = () => {
        document.getElementById('search').value = item.titulo;
        sugestoesDiv.innerHTML = '';
        sugestoesDiv.style.display = 'none';
        console.log(`Redirecionando para: /PAGES/player.html?id=${item.id}`);
        window.location.href = `/PAGES/player.html?id=${item.id}`;
    };

    container.appendChild(div);
}

// Criar versão debounced de buscarSugestoes com 300ms de espera
const debouncedBuscarSugestoes = debounce(buscarSugestoes, 300);

// Configurar evento de input no campo de pesquisa
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('search');
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            debouncedBuscarSugestoes(e.target.value);
        });
    } else {
        console.warn("⚠️ Elemento #search não encontrado.");
    }
});