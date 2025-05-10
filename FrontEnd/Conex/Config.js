// config.js
const BACKEND_URL = "https://filmes-flask.onrender.com";
const API_KEY = "aW9!7sd9e8e98jzK$p3Rt6yU*IUHhusdhibH2nCvE8q"; // Substitua pela sua chave real

// Função para fazer requisições autenticadas
async function fetchWithAuth(endpoint, options = {}) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: API_KEY, // Adiciona a API-Key no cabeçalho
        "Content-Type": "application/json",
        ...options.headers, // Preserva outros cabeçalhos, se fornecidos
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Chave de API inválida ou ausente");
      }
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error.message);
    throw error;
  }
}