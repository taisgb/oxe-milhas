document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cotacao-form');
    if (!form) return;

    const allSteps = Array.from(form.querySelectorAll('.form-step'));
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const statusMessage = document.getElementById('form-status-message');
    const tipoServicoInput = document.getElementById('tipo-servico');
    const cotacaoTitle = document.getElementById('cotacao-title');
    const cotacaoSubtitle = document.getElementById('cotacao-subtitle');
    const mentoriaCta = document.getElementById('mentoria-cotacao-btn');

    const numCriancasInput = document.getElementById('criancas');
    const numBebesInput = document.getElementById('bebes');
    const idadesCriancasContainer = document.getElementById('idades-criancas-container');
    const idadesBebesContainer = document.getElementById('idades-bebes-container');

    let service = 'viagem';
    let currentStep = 0;
    let activeSteps = [];

    const getServiceSteps = () => allSteps.filter(step => {
        const stepService = step.dataset.service || 'common';
        return stepService === 'common' || stepService === service;
    });

    const setIrrelevantFieldsDisabled = () => {
        allSteps.forEach(step => {
            const stepService = step.dataset.service || 'common';
            const enabled = stepService === 'common' || stepService === service;
            step.querySelectorAll('input, select, textarea, button').forEach(field => {
                if (field.type !== 'button' && field.type !== 'submit') {
                    field.disabled = !enabled;
                }
            });
        });
    };

    const updateProgressBar = () => {
        if (!progressBarFill || activeSteps.length === 0) return;
        const progressPercentage = ((currentStep + 1) / activeSteps.length) * 100;
        progressBarFill.style.width = `${progressPercentage}%`;
    };

    const updateFormSteps = () => {
        activeSteps = getServiceSteps();
        allSteps.forEach(step => step.classList.remove('active'));
        if (activeSteps[currentStep]) activeSteps[currentStep].classList.add('active');
        updateProgressBar();
    };

    const configureService = (nextService) => {
        service = nextService;
        currentStep = 0;
        statusMessage.textContent = '';
        statusMessage.className = '';

        if (tipoServicoInput) {
            tipoServicoInput.value = service === 'mentoria' ? 'mentoria_milhas' : 'cotacao_viagem';
        }

        if (service === 'mentoria') {
            cotacaoTitle.textContent = 'Solicite sua cotação de mentoria';
            cotacaoSubtitle.textContent = 'Conte um pouco sobre seu objetivo com milhas para prepararmos uma proposta personalizada.';
        } else {
            cotacaoTitle.textContent = 'Faça sua cotação de viagem';
            cotacaoSubtitle.textContent = 'Preencha os dados abaixo e receba uma proposta personalizada!';
        }

        setIrrelevantFieldsDisabled();
        updateFormSteps();
    };

    const validateStep = (stepIndex) => {
        const currentStepElement = activeSteps[stepIndex];
        if (!currentStepElement) return false;

        const fields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (field.type === 'radio') return;
            field.style.borderColor = 'var(--border-color)';
            if (!String(field.value || '').trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            }
        });

        const radioGroups = currentStepElement.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const firstRadio = group.querySelector('input[type="radio"]');
            if (!firstRadio || !firstRadio.required) return;

            const isChecked = currentStepElement.querySelector(`input[name="${firstRadio.name}"]:checked`);
            group.querySelectorAll('.radio-label').forEach(label => {
                label.style.borderColor = 'var(--border-color)';
            });

            if (!isChecked) {
                isValid = false;
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

    const generateAgeInputs = (count, container, type, unit, minAge, maxAge) => {
        if (!container) return;
        container.innerHTML = '';
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

    form.addEventListener('click', (event) => {
        const nextButton = event.target.closest('.btn-next');
        const prevButton = event.target.closest('.btn-prev');

        if (nextButton) {
            if (validateStep(currentStep) && currentStep < activeSteps.length - 1) {
                currentStep++;
                updateFormSteps();
            }
        }

        if (prevButton) {
            currentStep = Math.max(0, currentStep - 1);
            updateFormSteps();
        }
    });

    if (numCriancasInput) {
        numCriancasInput.addEventListener('change', () => {
            generateAgeInputs(parseInt(numCriancasInput.value || '0', 10), idadesCriancasContainer, 'criança', 'anos', 2, 11);
        });
    }

    if (numBebesInput) {
        numBebesInput.addEventListener('change', () => {
            generateAgeInputs(parseInt(numBebesInput.value || '0', 10), idadesBebesContainer, 'bebê', 'meses', 0, 23);
        });
    }

    if (mentoriaCta) {
        mentoriaCta.addEventListener('click', () => configureService('mentoria'));
    }

    document.querySelectorAll('a[href="#cotacao"]:not(.mentoria-quote-cta)').forEach(link => {
        link.addEventListener('click', () => configureService('viagem'));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateStep(currentStep)) return;

        const formData = new FormData(form);
        const submitButton = activeSteps[currentStep].querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }

        statusMessage.textContent = '';
        statusMessage.className = '';

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                statusMessage.textContent = service === 'mentoria'
                    ? 'Obrigado! Sua solicitação de mentoria foi enviada. Responderemos em breve.'
                    : 'Obrigado! Sua cotação foi enviada. Responderemos em breve.';
                statusMessage.className = 'success';
                form.reset();
                if (idadesCriancasContainer) idadesCriancasContainer.innerHTML = '';
                if (idadesBebesContainer) idadesBebesContainer.innerHTML = '';
                configureService(service);
            } else {
                return response.json().then(data => {
                    throw new Error(data.errors ? data.errors.map(error => error.message).join(', ') : 'Ocorreu um erro ao enviar. Tente novamente.');
                });
            }
        })
        .catch(error => {
            statusMessage.textContent = error.message || 'Erro de rede. Verifique sua conexão e tente novamente.';
            statusMessage.className = 'error';
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    });

    configureService('viagem');
});
