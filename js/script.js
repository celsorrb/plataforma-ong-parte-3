/**
 * js/utils.js
 * Funções auxiliares.
 */

/**
 * Carrega e retorna o conteúdo principal (dentro de <main>) de um arquivo HTML.
 * @param {string} url O caminho do arquivo HTML a ser carregado.
 * @returns {Promise<string>} O conteúdo HTML dentro da tag <main>.
 */
export async function loadPageContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o template: ${response.statusText}`);
        }
        const text = await response.text();
        
        // Cria um parser DOM para tratar o HTML como um template
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Extrai o conteúdo da tag <main> e retorna seu innerHTML
        const mainContent = doc.querySelector('main');
        if (mainContent) {
            return mainContent.innerHTML;
        } else {
            return '<h2>Conteúdo não encontrado.</h2><p>A tag main não foi encontrada no template.</p>';
        }
    } catch (error) {
        console.error("Erro no carregamento da página:", error);
        return `<h2>Erro de Carregamento</h2><p>Não foi possível carregar o conteúdo: ${error.message}</p>`;
    }
}