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

    if (texto.length < 2) return;

    try {
        console.log("🔍 Buscando:", texto);
        const res = await fetch(`${BACKEND_URL}/buscar?q=${encodeURIComponent(texto)}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        if (!res.ok) {
            throw new Error(`Erro ${res.status} ao buscar`);
        }
        const dados = await res.json();

        if (!dados || dados.length === 0) {
            sugestoesDiv.innerHTML = "<p style='padding: 10px;'>Nenhum resultado encontrado.</p>";
            return;
        }

        dados.forEach(item => {
            const div = document.createElement('div');
            div.className = 'sugestao-item';

            const img = document.createElement('img');
            img.src = item.capa || 'https://via.placeholder.com/40x60?text=?';

            const span = document.createElement('span');
            span.textContent = item.titulo;

            div.appendChild(img);
            div.appendChild(span);

            div.onclick = () => {
                window.location.href = `/PAGES/player.html?id=${item.id}`;
            };

            sugestoesDiv.appendChild(div);
        });
    } catch (err) {
        console.error('❌ Erro na busca:', err);
        sugestoesDiv.innerHTML = "<p style='padding: 10px; color: red;'>Erro ao buscar dados</p>";
    }
}

// Criar versão debounced de buscarSugestoes com 2 segundos de espera
const debouncedBuscarSugestoes = debounce(buscarSugestoes, 2000);

// Configurar evento de input no campo de pesquisa
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('input-busca');
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            debouncedBuscarSugestoes(e.target.value);
        });
    } else {
        console.warn("⚠️ Elemento #input-busca não encontrado.");
    }
});