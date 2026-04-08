// M1 Digital - Interactive JavaScript

/**
 * Hero Canvas Particle Network
 */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function isDarkMode() {
        return document.body.getAttribute('data-theme') === 'dark';
    }

    const CONFIG = {
        particleCount: 80,
        maxDistance: 160,
        particleSpeed: 0.3,
        mouseRadius: 200,
        get lineOpacity() { return isDarkMode() ? 0.12 : 0.2; },
        particleMinSize: 1,
        particleMaxSize: 2.5,
        get color() { return isDarkMode() ? { r: 0, g: 102, b: 204 } : { r: 0, g: 80, b: 170 }; }
    };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(CONFIG.particleCount, Math.floor((width * height) / 12000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
                size: Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize) + CONFIG.particleMinSize,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CONFIG.color.r}, ${CONFIG.color.g}, ${CONFIG.color.b}, ${p.opacity})`;
        ctx.fill();
    }

    function drawLine(p1, p2, dist) {
        const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${CONFIG.color.r}, ${CONFIG.color.g}, ${CONFIG.color.b}, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.mouseRadius) {
                    const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * 0.008;
                    p.vx -= dx * force;
                    p.vy -= dy * force;
                }
            }

            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
                p.vx = (p.vx / speed) * 1;
                p.vy = (p.vy / speed) * 1;
            }

            drawParticle(p);

            // Lines between close particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.maxDistance) {
                    drawLine(p, p2, dist);
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Init
    resize();
    createParticles();
    animate();

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createParticles();
        }, 200);
    });

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });
    observer.observe(canvas);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeIcon = document.querySelector('.theme-icon');

    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';

    // Update nav background
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.background = '';
    }

    try {
        localStorage.setItem('m1-digital-theme', newTheme);
    } catch(e) {}
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    const spans = mobileMenu.querySelectorAll('span');

    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    mobileMenu.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

/**
 * FAQ toggle functionality
 */
function toggleFAQ(element) {
    const faqItem = element.parentNode;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    const isOpen = answer.style.display === 'block';

    if (!isOpen) {
        answer.style.display = 'block';
        faqItem.classList.add('active');
        toggle.style.transform = 'rotate(180deg)';
        element.setAttribute('aria-expanded', 'true');
    } else {
        answer.style.display = 'none';
        faqItem.classList.remove('active');
        toggle.style.transform = 'rotate(0deg)';
        element.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Initialize theme on page load
 */
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('m1-digital-theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelector('.theme-icon').textContent = savedTheme === 'light' ? '🌙' : '☀️';
    } catch(e) {
        document.body.setAttribute('data-theme', 'light');
        document.querySelector('.theme-icon').textContent = '🌙';
    }
}

/**
 * Smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                const navLinks = document.querySelector('.nav-links');
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    const spans = mobileMenu.querySelectorAll('span');
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
            }
        });
    });
}

/**
 * Scroll-based nav enhancement — transparent over hero, solid after
 */
function initializeScrollEffects() {
    const nav = document.querySelector('nav');
    const hero = document.querySelector('.hero');
    if (!nav) return;

    // No hero on this page — always solid
    if (!hero) {
        nav.classList.add('nav-scrolled');
        return;
    }

    function updateNav() {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
}

/**
 * Intersection observer for scroll animations
 */
function initializeAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .service-card, .contact-card, .office-card, .faq-item, .news-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.5s ease ${index % 3 * 0.1}s, transform 0.5s ease ${index % 3 * 0.1}s`;
        observer.observe(card);
    });
}

/**
 * Hero content entrance animation
 */
function initializeLoadingAnimation() {
    const heroContent = document.querySelector('.hero .hero-content');
    const heroStats = document.querySelector('.hero-stats');
    const heroBadge = document.querySelector('.hero-badge');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        window.addEventListener('load', () => {
            setTimeout(() => {
                heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 200);
        });
    }

    if (heroStats) {
        heroStats.style.opacity = '0';
        heroStats.style.transform = 'translateX(-50%) translateY(20px)';

        window.addEventListener('load', () => {
            setTimeout(() => {
                heroStats.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                heroStats.style.opacity = '1';
                heroStats.style.transform = 'translateX(-50%) translateY(0)';
            }, 600);
        });
    }
}

/**
 * Keyboard navigation support
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }

        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
}

/**
 * Form handling
 */
function initializeFormHandling() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            e.preventDefault();
        }
    });
}

/**
 * Initialize everything
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initHeroCanvas();
    initializeSmoothScrolling();
    initializeScrollEffects();
    initializeAnimationObserver();
    initializeLoadingAnimation();
    initializeFormHandling();
    initializeKeyboardNavigation();
});

/**
 * Handle window resize
 */
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileMenu) {
            const spans = mobileMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// Public API
window.M1Digital = {
    toggleTheme,
    toggleMobileMenu,
    toggleFAQ,
    initializeTheme
};
