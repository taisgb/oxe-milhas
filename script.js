document.addEventListener('DOMContentLoaded', () => {


    // ---- MENU HAMBURGER MOBILE ----
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const menuLinks = document.querySelectorAll('.nav-menu a');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            
            // Previne scroll quando menu está aberto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Fecha o menu ao clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ---- SMOOTH SCROLLING PARA LINKS INTERNOS ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- CONTADOR ANIMADO NO HERO ----
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formata números grandes
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + 'K';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    };

    // Inicia contadores quando a seção hero está visível
    const heroSection = document.getElementById('hero');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateCounter(stat, target);
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // ---- ALTERNADOR DE PLANOS ----
    const btnMentoria = document.getElementById('btn-mentoria');
    const btnCloseFriends = document.getElementById('btn-closefriends');
    const mentoriaPlans = document.getElementById('mentoria-plans');
    const closeFriendsPlans = document.getElementById('closefriends-plans');

    if (btnMentoria && btnCloseFriends && mentoriaPlans && closeFriendsPlans) {
        btnMentoria.addEventListener('click', () => {
            btnMentoria.classList.add('toggle-active');
            mentoriaPlans.classList.add('active');
            btnCloseFriends.classList.remove('toggle-active');
            closeFriendsPlans.classList.remove('active');
            
            // Animação suave
            mentoriaPlans.style.opacity = '0';
            setTimeout(() => {
                mentoriaPlans.style.opacity = '1';
            }, 150);
        });

        btnCloseFriends.addEventListener('click', () => {
            btnCloseFriends.classList.add('toggle-active');
            closeFriendsPlans.classList.add('active');
            btnMentoria.classList.remove('toggle-active');
            mentoriaPlans.classList.remove('active');
            
            // Animação suave
            closeFriendsPlans.style.opacity = '0';
            setTimeout(() => {
                closeFriendsPlans.style.opacity = '1';
            }, 150);
        });
    }

    // ---- ACORDEÃO DO FAQ ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });

            // Toggle do item atual
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---- ANIMAÇÕES ON SCROLL ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Adiciona classe de animação a elementos específicos
    const animateElements = document.querySelectorAll(`
        .section-header,
        .about-main-wrapper > *,
        .info-card,
        .product-card,
        .testimonial-card,
        .plan,
        .faq-item
    `);

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ---- EFEITOS DE HOVER NOS CARDS ----
    const cards = document.querySelectorAll('.product-card, .info-card, .plan, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- PARALLAX SUAVE PARA ELEMENTOS FLUTUANTES ----
    const floatingElements = document.querySelectorAll('.floating-element, .decoration-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // ---- VALIDAÇÃO DE FORMULÁRIO ----
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }

    // ---- EFEITO DE TYPING NO HERO ----
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    line.textContent += text[i];
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                    }
                }, 50);
            }, index * 1000 + 500);
        });
    }

    // ---- BOTÕES COM EFEITO RIPPLE ----
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ---- LAZY LOADING PARA IMAGENS ----
    const images = document.querySelectorAll('img[src*="placeholder"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // ---- SCROLL TO TOP BUTTON ----
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ---- PERFORMANCE OPTIMIZATION ----
    // Debounce function para otimizar eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Aplica debounce aos eventos de scroll
    const debouncedScrollHandler = debounce(() => {
        // Handlers de scroll otimizados aqui
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
});

// ---- CSS ADICIONAL PARA EFEITOS ----
const additionalStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .scroll-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Adiciona os estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);