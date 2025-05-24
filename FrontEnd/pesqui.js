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
 * Busca sugestões de filmes ou séries com base no texto digitado.
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
        const res = await fetch(`${BACKEND_URL}/buscar?q=${encodeURIComponent(texto)}&pagina=1`, {
            headers: { 'X-API-Key': API_KEY }
        });

        if (!res.ok) {
            throw new Error(`Erro ${res.status}: ${res.statusText}`);
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

        // Exibir até 5 sugestões
        dados.resultados.slice(0, 5).forEach(item => {
            const div = document.createElement('div');
            div.className = 'sugestao-item';

            const img = document.createElement('img');
            img.src = item.capa || 'https://via.placeholder.com/40x60?text=?';
            img.alt = item.titulo;
            img.style.width = '40px';
            img.style.height = 'auto';
            img.style.marginRight = '10px';

            const span = document.createElement('span');
            span.textContent = item.titulo;

            div.appendChild(img);
            div.appendChild(span);

            div.onclick = () => {
                document.getElementById('search').value = item.titulo;
                sugestoesDiv.innerHTML = '';
                sugestoesDiv.style.display = 'none';
                window.location.href = `/PAGES/resultados.html?q=${encodeURIComponent(item.titulo)}`;
            };

            sugestoesDiv.appendChild(div);
        });

        sugestoesDiv.style.display = 'block';
    } catch (err) {
        console.error('❌ Erro ao buscar sugestões:', err);
        sugestoesDiv.innerHTML = "<p style='padding: 10px; color: red;'>Erro ao buscar dados</p>";
        sugestoesDiv.style.display = 'block';
    }
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