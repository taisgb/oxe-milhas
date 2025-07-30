document.addEventListener('DOMContentLoaded', () => { 
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.carousel-track');
    const prevBtn = wrapper.querySelector('.prev-btn');
    const nextBtn = wrapper.querySelector('.next-btn');
    const originalCards = Array.from(track.children);
    
    if (originalCards.length === 0) return;

    const SPEED = 45; 
    const RESUME_DELAY = 5000;
    let currentPosition = 0;
    let isPausedByInteraction = false;
    let animationFrameId;
    let resumeTimeoutId;

    function initialize() {
        stopAnimation();
        track.innerHTML = '';
        originalCards.forEach(card => track.appendChild(card));

        if (wrapper.offsetWidth > 0) {
            while (track.scrollWidth < wrapper.offsetWidth * 2) {
                originalCards.forEach(card => {
                    track.appendChild(card.cloneNode(true));
                });
            }
        }
        currentPosition = 0;
        startAnimation();
    }
    
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

    // --- INICIALIZAÇÃO INSTANTÂNEA ---
    initialize();
    window.addEventListener('resize', initialize);
    
    nextBtn.addEventListener('click', () => snapToCard(1));
    prevBtn.addEventListener('click', () => snapToCard(-1));
    wrapper.addEventListener('mouseenter', stopAnimation);
    wrapper.addEventListener('mouseleave', () => {
        clearTimeout(resumeTimeoutId);
        resumeTimeoutId = setTimeout(startAnimation, RESUME_DELAY);
    });
});