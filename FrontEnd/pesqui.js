

// Função de buscar sugestões
async function buscarSugestoes(texto) {
    const sugestoesDiv = document.getElementById('sugestoes');
    sugestoesDiv.innerHTML = '';

    if (texto.length < 2) return;

    try {
        console.log("🔍 Buscando:", texto);
        const res = await fetch(`${BACKEND_URL}/buscar?q=${encodeURIComponent(texto)}`);
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
                window.location.href = `PAGES/player.html?id=${item.id}`;
            };

            sugestoesDiv.appendChild(div);
        });
    } catch (err) {
        console.error('❌ Erro na busca:', err);
        sugestoesDiv.innerHTML = "<p style='padding: 10px; color: red;'>Erro ao buscar dados</p>";
    }
}
