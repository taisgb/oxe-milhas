window.addEventListener('load', () => { 

    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const container = track.parentElement; // O .logo-carousel-container

    // --- CONFIGURAÇÕES ---
    const SPEED = 50; 

    // --- VARIÁVEIS DE ESTADO ---
    //A posição inicial é a largura do container, para começar fora da tela.
    let position = container.offsetWidth; 
    let isPaused = false;
    let animationFrameId;

    // --- LÓGICA ---
    const originalCards = Array.from(track.children);
    
    const setupClones = () => {
        while (track.offsetWidth < container.offsetWidth * 2) {
            originalCards.forEach(card => {
                track.appendChild(card.cloneNode(true));
            });
        }
    }

    function animate() {
        if (isPaused) return; 

        position -= SPEED / 60; 

        const firstCard = track.firstElementChild;
        const gap = parseFloat(window.getComputedStyle(track).gap);
        const cardWidthWithGap = firstCard.offsetWidth + gap;
        
        if (Math.abs(position) >= cardWidthWithGap) {
            track.appendChild(firstCard);
            position += cardWidthWithGap;
        }

        track.style.transform = `translateX(${position}px)`;
        animationFrameId = requestAnimationFrame(animate);
    }

    // --- EVENTOS DE INTERAÇÃO ---
    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => {
        if (isPaused) { // Só reinicia se estava pausado por este evento
            isPaused = false;
            animate();
        }
    });

    // --- INICIALIZAÇÃO ---
    setupClones();
    
    // Aplica a posição inicial antes de começar a animar.
    track.style.transform = `translateX(${position}px)`; 
    
    animate(); // Inicia a animação

    // Adiciona um listener para recalcular os clones se a tela for redimensionada
    window.addEventListener('resize', () => {
        // Para a animação, recalcula e reinicia
        cancelAnimationFrame(animationFrameId);
        // Pequeno delay para garantir que o DOM atualizou as larguras
        setTimeout(() => {
            position = container.offsetWidth;
            setupClones();
            animate();
        }, 50);
    });
});