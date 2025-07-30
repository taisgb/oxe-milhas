document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('cotacao-form');
    if (!form) return; // Só executa se o formulário existir na página

    // Seletores do DOM
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const nextButtons = form.querySelectorAll('.btn-next');
    const prevButtons = form.querySelectorAll('.btn-prev');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    
    // Inputs de passageiros
    const numCriancasInput = document.getElementById('criancas');
    const numBebesInput = document.getElementById('bebes');
    
    // Containers para idades
    const idadesCriancasContainer = document.getElementById('idades-criancas-container');
    const idadesBebesContainer = document.getElementById('idades-bebes-container');

    const statusMessage = document.getElementById('form-status-message');
    
    let currentStep = 0;

    // --- FUNÇÕES DE NAVEGAÇÃO E UI ---
    const updateFormSteps = () => {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        updateProgressBar();
    };

    const updateProgressBar = () => {
        if (progressBarFill) {
            const progressPercentage = (currentStep / (steps.length - 1)) * 100;
            progressBarFill.style.width = `${progressPercentage}%`;
        }
    };

    // --- VALIDAÇÃO DOS PASSOS (ATUALIZADA) ---
    const validateStep = (stepIndex) => {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        // Valida inputs de texto, email, numero, etc.
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
            if (input.type !== 'radio' && !input.value.trim()) {
                input.style.borderColor = '#ef4444'; // Cor de erro
                isValid = false;
            }
        });

        // Validação específica para grupos de rádio
        const radioGroups = currentStepElement.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const radioName = group.querySelector('input[type="radio"]').name;
            const isChecked = currentStepElement.querySelector(`input[name="${radioName}"]:checked`);
            
            // Limpa estilos de erro anteriores
            group.querySelectorAll('.radio-label').forEach(label => {
                label.style.borderColor = 'var(--border-color)';
            });

            if (!isChecked) {
                isValid = false;
                // Adiciona uma borda de erro em todos os labels do grupo
                group.querySelectorAll('.radio-label').forEach(label => {
                    label.style.borderColor = '#ef4444';
                });
            }
        });

        if (!isValid) {
            statusMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            statusMessage.className = 'error';
        } else {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }
        return isValid;
    };


    // --- LÓGICA CONDICIONAL DE IDADES ---
    const generateAgeInputs = (count, container, type, unit, minAge, maxAge) => {
        container.innerHTML = ''; // Limpa o container
        if (count > 0) {
            const title = document.createElement('label');
            title.textContent = `Idade de cada ${type}`;
            title.className = 'age-title';
            container.appendChild(title);

            for (let i = 1; i <= count; i++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.name = `idade-${type}-${i}`;
                input.placeholder = `${type} ${i} (${unit})`;
                input.min = minAge;
                input.max = maxAge;
                input.required = true;
                container.appendChild(input);
            }
        }
    };

    // --- EVENT LISTENERS ---
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateFormSteps();
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
        });
    });

    if (numCriancasInput) {
        numCriancasInput.addEventListener('change', () => {
            generateAgeInputs(parseInt(numCriancasInput.value), idadesCriancasContainer, 'criança', 'anos', 2, 11);
        });
    }

    if (numBebesInput) {
        numBebesInput.addEventListener('change', () => {
            generateAgeInputs(parseInt(numBebesInput.value), idadesBebesContainer, 'bebê', 'meses', 0, 23);
        });
    }

    // --- ENVIO DO FORMULÁRIO PARA O FORMSPREE ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        statusMessage.textContent = '';
        statusMessage.className = '';

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                statusMessage.textContent = "Obrigado! Sua cotação foi enviada. Responderemos em breve.";
                statusMessage.className = 'success';
                form.reset();
                currentStep = 0;
                updateFormSteps();
                if (idadesCriancasContainer) idadesCriancasContainer.innerHTML = '';
                if (idadesBebesContainer) idadesBebesContainer.innerHTML = '';
            } else {
                response.json().then(data => {
                    statusMessage.textContent = data.errors ? data.errors.map(error => error.message).join(", ") : "Ocorreu um erro ao enviar. Tente novamente.";
                    statusMessage.className = 'error';
                });
            }
        })
        .catch(error => {
            statusMessage.textContent = "Erro de rede. Verifique sua conexão e tente novamente.";
            statusMessage.className = 'error';
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Cotação';
        });
    });

    // Inicia o formulário no estado correto
    updateFormSteps();
});