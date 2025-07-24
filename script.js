// M1 Digital - Interactive JavaScript Functions

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const themeIcon = document.querySelector('.theme-icon');
    
    // Apply new theme
    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    
    // Save theme preference (if localStorage is available)
    try {
        localStorage.setItem('m1-digital-theme', newTheme);
    } catch(e) {
        console.log('Local storage not available');
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    const spans = mobileMenu.querySelectorAll('span');
    
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    if (navLinks.classList.contains('active')) {
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
 * FAQ toggle functionality (for contact page)
 */
function toggleFAQ(element) {
    const faqItem = element.parentNode;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
        faqItem.classList.add('active');
        toggle.style.transform = 'rotate(180deg)';
    } else {
        answer.style.display = 'none';
        faqItem.classList.remove('active');
        toggle.style.transform = 'rotate(0deg)';
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
        // Fallback to light theme if localStorage is not available
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
                
                // Close mobile menu if open
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
 * Add scroll effect to navigation
 */
function initializeScrollEffects() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background blur based on scroll position
        if (scrollTop > 50) {
            nav.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(4, 30, 66, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.background = document.body.getAttribute('data-theme') === 'dark' 
                ? 'rgba(4, 30, 66, 0.9)'
                : 'rgba(255, 255, 255, 0.9)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Add intersection observer for animations
 */
function initializeAnimationObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards, service cards, contact cards, and office cards
    document.querySelectorAll('.feature-card, .service-card, .contact-card, .office-card, .faq-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Add loading animation
 */
function initializeLoadingAnimation() {
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        // Add initial loading state
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        // Animate in after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        });
    }
}

/**
 * Handle form submissions (if forms are added later)
 */
function initializeFormHandling() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            e.preventDefault();
            // Add form handling logic here
            console.log('Form submitted:', new FormData(form));
        }
    });
}

/**
 * Add keyboard navigation support
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Toggle theme with Ctrl/Cmd + Shift + T
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
}

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSmoothScrolling();
    initializeScrollEffects();
    initializeAnimationObserver();
    initializeLoadingAnimation();
    initializeFormHandling();
    initializeKeyboardNavigation();
    
    console.log('M1 Digital website initialized successfully');
});

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Close mobile menu on window resize if it's open
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

/**
 * Add performance monitoring
 */
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`M1 Digital page loaded in ${loadTime}ms`);
    }
});

// Export functions for potential external use
window.M1Digital = {
    toggleTheme,
    toggleMobileMenu,
    toggleFAQ,
    initializeTheme
};