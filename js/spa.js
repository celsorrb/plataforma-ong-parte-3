/**
 * js/spa.js
 * Lógica de Single Page Application (SPA) e Roteamento.
 */
import { loadPageContent } from './utils.js';
import { attachCadastroListeners } from './cadastro.js';

// Mapeamento de rotas: 'hash' -> 'caminho_do_template.html' (Todos na raiz)
const routes = {
    'home': 'home-content.html', 
    'projetos': 'projetos.html',
    'cadastro': 'cadastro.html',
    '': 'home-content.html' // Rota padrão
};

const mainContainer = document.getElementById('conteudo-principal');

async function loadView(pageKey) {
    const templatePath = routes[pageKey] || routes['home'];
    
    try {
        const content = await loadPageContent(templatePath);
        mainContainer.innerHTML = content;
        
        if (pageKey === 'cadastro') {
            attachCadastroListeners();
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPageKey = link.getAttribute('data-page');
            if (linkPageKey === pageKey) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    } catch (error) {
        // Mensagem de erro para ajudar na depuração no navegador
        mainContainer.innerHTML = `<h2>Erro de Navegação</h2><p>Não foi possível carregar a página: ${templatePath}. Verifique o nome do arquivo e o console (F12).</p>`;
        console.error("Erro no SPA:", error);
    }
    mainContainer.scrollIntoView({ behavior: 'smooth' });
}

function router() {
    let hash = window.location.hash.slice(1).toLowerCase();
    
    if (hash.includes('-')) {
        hash = hash.split('-')[0];
    }

    const pageKey = hash || 'home';
    loadView(pageKey);
}

window.addEventListener('hashchange', router);

export function initSPA() {
    // Lógica do botão hamburguer (Mantenha se estiver usando)
    const hamburguer = document.getElementById('hamburguer-toggle');
    const nav = document.getElementById('main-nav');
    
    if (hamburguer && nav) {
        hamburguer.addEventListener('click', () => {
            const isExpanded = hamburguer.getAttribute('aria-expanded') === 'true' || false;
            hamburguer.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('is-open');
        });
    }

    // Carrega a view inicial
    router();
}