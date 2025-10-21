/**
 * js/utils.js
 * Funções auxiliares.
 */

/**
 * Carrega e retorna o conteúdo principal de um arquivo HTML (fragmento).
 */
export async function loadPageContent(url) {
    try {
        const response = await fetch(url); // O FETCH que falha localmente
        if (!response.ok) {
            throw new Error(`Erro de rede ou arquivo não encontrado: ${response.statusText} (${response.status})`);
        }
        const text = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const mainContent = doc.querySelector('main');

        // Retorna o conteúdo da tag <main> se existir, senão retorna o corpo (body) inteiro,
        // que é o que esperamos de um fragmento HTML.
        if (mainContent) {
            return mainContent.innerHTML;
        } else {
             return doc.body.innerHTML;
        }

    } catch (error) {
        console.error("Falha ao carregar o conteúdo:", error);
        throw new Error(`Falha ao carregar o conteúdo de ${url}. Detalhes: ${error.message}`);
    }
}