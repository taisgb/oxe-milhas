document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.carousel-track');
    const prevBtn = wrapper.querySelector('.prev-btn');
    const nextBtn = wrapper.querySelector('.next-btn');
    const originalCards = Array.from(track.children);
    
    if (originalCards.length === 0) return;

    // --- CONFIGURAÇÕES ---
    const SPEED = 25; // Velocidade em pixels por segundo.
    const RESUME_DELAY = 0; // 0s de espera para retomar a animação.

    // --- VARIÁVEIS DE ESTADO ---
    let currentPosition = 0;
    let isPausedByInteraction = false;
    let animationFrameId;
    let resumeTimeoutId;

    // --- CLONAGEM ---
    // A lógica agora garante que a pista seja longa o suficiente para o loop.
    function setupClones() {
        // Remove clones antigos antes de recalcular, caso haja redimensionamento da tela
        while (track.children.length > originalCards.length) {
            track.removeChild(track.lastChild);
        }

        // Continua adicionando clones até a pista ser pelo menos 2x mais larga que o container
        while (track.scrollWidth < wrapper.offsetWidth * 2) {
            originalCards.forEach(card => {
                track.appendChild(card.cloneNode(true));
            });
        }
    }

    // --- LÓGICA DA ANIMAÇÃO ---
    function animate() {
        if (isPausedByInteraction) return;

        currentPosition -= SPEED / 60;

        const firstCard = track.firstElementChild;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const cardWidthWithGap = firstCard.offsetWidth + gap;
        
        if (Math.abs(currentPosition) >= cardWidthWithGap) {
            track.appendChild(firstCard);
            currentPosition += cardWidthWithGap;
        }
        
        track.style.transform = `translateX(${currentPosition}px)`;
        animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        isPausedByInteraction = false;
        track.style.transition = 'none';
        animate();
    }

    function stopAnimation() {
        isPausedByInteraction = true;
        cancelAnimationFrame(animationFrameId);
        clearTimeout(resumeTimeoutId);
    }
    
    function snapToCard(direction) {
        stopAnimation();
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const cardWidthWithGap = track.firstElementChild.offsetWidth + gap;
        
        currentPosition -= direction * cardWidthWithGap;
        track.style.transition = 'transform 0.5s ease-out';
        track.style.transform = `translateX(${currentPosition}px)`;
        
        resumeTimeoutId = setTimeout(startAnimation, RESUME_DELAY);
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    function initialize() {
        stopAnimation(); // Para qualquer animação anterior
        setupClones();   // Roda a nova lógica de clonagem
        startAnimation(); // Inicia a nova animação
    }

    nextBtn.addEventListener('click', () => snapToCard(1));
    prevBtn.addEventListener('click', () => snapToCard(-1));
    wrapper.addEventListener('mouseenter', stopAnimation);
    wrapper.addEventListener('mouseleave', () => {
        clearTimeout(resumeTimeoutId);
        resumeTimeoutId = setTimeout(startAnimation, RESUME_DELAY);
    });

    // Roda a inicialização quando a página carrega e também se a tela for redimensionada
    initialize();
    window.addEventListener('resize', initialize);
});