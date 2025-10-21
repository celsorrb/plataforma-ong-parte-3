/**
 * js/cadastro.js
 * Sistema de verificação de consistência de dados em formulários.
 */

// Seletor para o formulário de cadastro
const FORM_SELECTOR = '#cadastroForm';
// Seletor para o alerta de opções de contribuição
const ALERTA_AJUDA_SELECTOR = '#alerta-ajuda';

// Funções auxiliares para validação...
function displayError(input, message) {
    removeError(input);
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    error.setAttribute('role', 'alert');
    input.classList.add('input-error');
    input.parentNode.insertBefore(error, input.nextSibling);
}

function removeError(input) {
    input.classList.remove('input-error');
    const nextElement = input.nextElementSibling;
    if (nextElement && nextElement.classList.contains('error-message')) {
        nextElement.remove();
    }
}

function validateCPF(cpf) {
    const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return pattern.test(cpf);
}

function validatePhone(phone) {
    const pattern = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return pattern.test(phone);
}

function validateFormatoCep(cep) {
    const pattern = /^\d{5}-\d{3}$/;
    return pattern.test(cep);
}

/**
 * Anexa todos os event listeners ao formulário de cadastro após ele ser injetado no DOM.
 */
export function attachCadastroListeners() {
    const form = document.querySelector(FORM_SELECTOR);
    
    if (form) {
        // 1. Validação em tempo real (on blur) para campos obrigatórios
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                 if (input.id === 'cpf') {
                    if (!validateCPF(input.value)) displayError(input, 'CPF inválido. Use o formato: 000.000.000-00');
                    else removeError(input);
                } else if (input.id === 'telefone') {
                    if (!validatePhone(input.value)) displayError(input, 'Telefone inválido. Use o formato: (00) 00000-0000');
                    else removeError(input);
                } else if (input.id === 'cep') {
                    if (!validateFormatoCep(input.value)) displayError(input, 'Formato de CEP inválido. Use 00000-000');
                    else removeError(input);
                } else if (!input.checkValidity()) {
                    displayError(input, input.title || 'Valor incorreto ou incompleto.');
                } else if (!input.value.trim()) {
                     displayError(input, 'Este campo é obrigatório.');
                } else {
                    removeError(input);
                }
            });
        });
        
        // 2. Simulação de preenchimento automático de endereço (em blur do CEP)
        const cepInput = form.querySelector('#cep');
        if (cepInput) {
            cepInput.addEventListener('blur', () => {
                if (validateFormatoCep(cepInput.value)) {
                    removeError(cepInput);
                    // SIMULAÇÃO: Preenche após 500ms
                    setTimeout(() => {
                        form.querySelector('#endereco').value = 'Rua de Exemplo, 987, Bairro Fictício';
                        form.querySelector('#cidade').value = 'Cidade Fictícia';
                        form.querySelector('#estado').value = 'SP';
                        
                        removeError(form.querySelector('#endereco'));
                        removeError(form.querySelector('#cidade'));
                    }, 500);
                } else if (cepInput.value.trim()) {
                    displayError(cepInput, 'Formato de CEP inválido. Use 00000-000');
                }
            });
        }
        
        // 3. Validação final no Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Exemplo de verificação de checkboxes
            const voluntarioChecked = form.querySelector('#voluntario').checked;
            const doadorChecked = form.querySelector('#doador').checked;

            if (!voluntarioChecked && !doadorChecked) {
                 const alerta = document.querySelector(ALERTA_AJUDA_SELECTOR);
                 if (alerta) alerta.style.borderColor = 'var(--cor-erro)';
                 alert('Por favor, selecione pelo menos uma opção de contribuição (Voluntário ou Doador).');
                 return;
            }
            
            // Se o código chegar aqui, o formulário está visualmente válido.
            alert('Formulário enviado com sucesso! Aguarde contato para os próximos passos.');
            form.reset();
        });
    }
}