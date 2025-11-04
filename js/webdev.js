// Animated Counter for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                animateCounter(counter);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// Parallax Effect on Mouse Move
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.visual-card');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
        const speed = (index + 1) * 5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        card.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Move floating icons
    const icons = document.querySelectorAll('.icon-item');
    icons.forEach((icon, index) => {
        const speed = (index + 1) * 3;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Gradient Text Animation
const gradientText = document.querySelector('.gradient-text');
if (gradientText) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        gradientText.style.backgroundImage = `linear-gradient(135deg, 
            hsl(${hue}, 70%, 60%), 
            hsl(${(hue + 60) % 360}, 70%, 60%))`;
    }, 50);
}

// Button Ripple Effect
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-primary-large, .btn-outline, .btn-outline-large').forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Card Tilt Effect on Hover
document.querySelectorAll('.visual-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'transform 0.1s';
    });

    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transition = 'transform 0.5s';
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Template card hover effects
const templateCards = document.querySelectorAll('.template-card');
templateCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const overlay = card.querySelector('.template-overlay');
        if (overlay) {
            overlay.style.background = 'linear-gradient(to top, rgba(102, 126, 234, 0.9), transparent)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const overlay = card.querySelector('.template-overlay');
        if (overlay) {
            overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)';
        }
    });
});

// Browse Template Button
const browseTemplateBtn = document.querySelector('.btn-outline');
if (browseTemplateBtn) {
    browseTemplateBtn.addEventListener('click', () => {
        window.location.href = "/template.html";
    });
}

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    width: 0%;
    z-index: 10000;
    transition: width 0.2s;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    z-index: 999;
    transition: all 0.3s;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// Intersection Observer for fade-in animations on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe web service details
const serviceDetails = document.querySelectorAll('.web-service-detail');
serviceDetails.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// Add loading states to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function () {
        if (!this.classList.contains('loading')) {
            const originalText = this.textContent;

            // Only add loading for certain buttons
            if (this.classList.contains('btn-primary') ||
                this.classList.contains('btn-primary-large') ||
                this.classList.contains('btn-secondary')) {

                this.classList.add('loading');
                this.disabled = true;
                const originalHTML = this.innerHTML;
                this.innerHTML = '<span>Loading...</span>';

                // Simulate action (remove this in production)
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                    this.innerHTML = originalHTML;
                }, 1500);
            }
        }
    });
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';

        // Create celebration effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 30);
        }

        alert('🎉 Easter egg activated! You found the Konami code!');
    }
});

// Confetti function for easter egg
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: 50%;
        animation: fall 3s linear forwards;
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
}

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    @keyframes fall {
        to {
            top: 100vh;
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(rainbowStyle);

// Console Branding
console.log('%c🚀 Web Development Services', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with ❤️ using Vanilla JavaScript', 'font-size: 14px; color: #764ba2;');
console.log('%cInterested in working with us? Contact us today!', 'font-size: 12px; color: #64748b;');

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Page loaded in ${(perfData.loadEventEnd - perfData.fetchStart) / 1000}s`);
    });
}

// Log page interactions
let clickCount = 0;
document.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 10) {
        console.log('🎯 You\'ve clicked 10 times! You\'re really exploring this page!');
    }
});