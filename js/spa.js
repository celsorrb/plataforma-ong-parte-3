/**
 * js/spa.js
 * Lógica de Single Page Application (SPA) e Roteamento.
 */
import { loadPageContent } from './utils.js';
import { attachCadastroListeners } from './cadastro.js';

// CORREÇÃO CRÍTICA: Define o caminho base do repositório
// O nome do seu repositório é 'plataforma-ong-parte-3'
const BASE_PATH = '/plataforma-ong-parte-3/'; 

// Mapeamento de rotas: 'hash' -> 'caminho_do_template.html'
const routes = {
    // Usamos o BASE_PATH para que o fetch encontre os arquivos corretamente
    'home': BASE_PATH + 'home-content.html', 
    'projetos': BASE_PATH + 'projetos.html',
    'cadastro': BASE_PATH + 'cadastro.html',
    '': BASE_PATH + 'home-content.html' // Rota padrão
};

const mainContainer = document.getElementById('conteudo-principal');

async function loadView(pageKey) {
    const templatePath = routes[pageKey] || routes['home'];
    
    try {
        const content = await loadPageContent(templatePath);
        mainContainer.innerHTML = content;
        
        // Se a página carregada for o cadastro, anexa os listeners (validação, máscaras, etc.)
        if (pageKey === 'cadastro') {
            // NOTE: A função attachCadastroListeners precisa ser exportada em cadastro.js
            attachCadastroListeners();
        }

        // Atualiza o estado visual da navegação (aria-current)
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
    
    // Trata links com sub-rotas ou âncoras (#projetos-atuais)
    if (hash.includes('-')) {
        hash = hash.split('-')[0];
    }

    const pageKey = hash || 'home';
    loadView(pageKey);
}

// Escuta a mudança de hash na URL
window.addEventListener('hashchange', router);

// Exporta a função de inicialização
export function initSPA() {
    // Carrega a página inicial ou a rota atual ao carregar o site
    router();
    
    // Lógica do botão hambúrguer (Pode ser transferida para script.js se for mais genérica)
    const hamburguer = document.getElementById('hamburguer-toggle');
    const nav = document.getElementById('main-nav');
    
    if (hamburguer && nav) {
        hamburguer.addEventListener('click', () => {
            const isExpanded = hamburguer.getAttribute('aria-expanded') === 'true' || false;
            nav.classList.toggle('open'); 
            hamburguer.setAttribute('aria-expanded', !isExpanded);
        });
    }
}
