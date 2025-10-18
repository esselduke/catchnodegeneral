/* ====================================
   CATCHNODE - MAIN JAVASCRIPT
   ==================================== */

(function() {
    'use strict';

    /* ====================================
       UTILITY FUNCTIONS
       ==================================== */
    
    // Debounce function for performance
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

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /* ====================================
       HEADER & NAVIGATION
       ==================================== */
    
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    // Sticky header scroll effect (add shadow on scroll)
    let lastScroll = 0;
    const handleScroll = throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Mobile hamburger menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            
            hamburger.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // Toggle scroll lock
            if (!isExpanded) {
                body.classList.add('scroll-lock');
            } else {
                body.classList.remove('scroll-lock');
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                body.classList.remove('scroll-lock');
                hamburger.focus();
            }
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                body.classList.remove('scroll-lock');
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                body.classList.remove('scroll-lock');
            });
        });
    }

    // Desktop dropdown navigation
    const dropdowns = document.querySelectorAll('.header__nav-item--dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.header__dropdown-toggle');
        const menu = dropdown.querySelector('.header__dropdown');
        
        if (!toggle || !menu) return;

        // Keyboard navigation
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    const firstLink = menu.querySelector('.header__dropdown-link');
                    if (firstLink) firstLink.focus();
                }
            } else if (e.key === 'Escape') {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });

        // Arrow key navigation within dropdown
        const dropdownLinks = menu.querySelectorAll('.header__dropdown-link');
        dropdownLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = dropdownLinks[index + 1] || dropdownLinks[0];
                    nextLink.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = dropdownLinks[index - 1] || dropdownLinks[dropdownLinks.length - 1];
                    prevLink.focus();
                } else if (e.key === 'Escape') {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle focus leaving dropdown
        dropdown.addEventListener('focusout', (e) => {
            // Small delay to allow focus to move to next element
            setTimeout(() => {
                if (!dropdown.contains(document.activeElement)) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }, 100);
        });
    });

    /* ====================================
       TESTIMONIALS SLIDER
       ==================================== */
    
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    
    if (testimonialsSlider) {
        const track = testimonialsSlider.querySelector('.testimonials-slider__track');
        const testimonials = Array.from(testimonialsSlider.querySelectorAll('.testimonial'));
        const prevBtn = testimonialsSlider.querySelector('.testimonials-slider__btn--prev');
        const nextBtn = testimonialsSlider.querySelector('.testimonials-slider__btn--next');
        const dotsContainer = testimonialsSlider.querySelector('.testimonials-slider__dots');
        
        let currentIndex = 0;
        let autoplayInterval;
        const autoplayDelay = 7000; // 7 seconds

        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('testimonials-slider__dot');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === 0);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.testimonials-slider__dot'));

        function updateSlider() {
            testimonials.forEach((testimonial, index) => {
                testimonial.classList.toggle('active', index === currentIndex);
                testimonial.setAttribute('aria-hidden', index !== currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
                dot.setAttribute('aria-selected', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateSlider();
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Button event listeners
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Keyboard navigation
        testimonialsSlider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoplay();
            }
        }

        // Pause autoplay on hover/focus
        testimonialsSlider.addEventListener('mouseenter', stopAutoplay);
        testimonialsSlider.addEventListener('mouseleave', startAutoplay);
        testimonialsSlider.addEventListener('focusin', stopAutoplay);
        testimonialsSlider.addEventListener('focusout', startAutoplay);

        // Initialize
        updateSlider();
        startAutoplay();
    }

    /* ====================================
       FAQ ACCORDION
       ==================================== */
    
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        const answerContent = item.querySelector('.faq-item__answer-content');

        if (!question || !answer || !answerContent) return;

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items (optional - remove these lines for multiple open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-item__question');
                    const otherAnswer = otherItem.querySelector('.faq-item__answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0';
                }
            });

            // Toggle current item
            question.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Open
                answer.style.maxHeight = answerContent.scrollHeight + 'px';
            } else {
                // Close
                answer.style.maxHeight = '0';
            }
        });

        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });

        // Initialize closed state
        answer.style.maxHeight = '0';
    });

    /* ====================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ==================================== */
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty anchors
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    /* ====================================
       INTERSECTION OBSERVER (Scroll Reveals)
       ==================================== */
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

    // Observe elements with .reveal class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Add reveal class to sections automatically
    const autoRevealSections = document.querySelectorAll('.service-card, .outcome-card, .testimonials-slider, .case-highlight__content, .case-highlight__visual');
    autoRevealSections.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    /* ====================================
       FORM VALIDATION (for contact page - will be used later)
       ==================================== */
    
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const formData = {};

            // Get all form fields
            const fields = contactForm.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                const value = field.value.trim();
                const fieldName = field.name;
                
                // Clear previous errors
                field.classList.remove('error');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();

                // Required field validation
                if (field.hasAttribute('required') && !value) {
                    showError(field, 'This field is required');
                    isValid = false;
                    return;
                }

                // Email validation
                if (field.type === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        showError(field, 'Please enter a valid email address');
                        isValid = false;
                        return;
                    }
                }

                formData[fieldName] = value;
            });

            if (isValid) {
                // Show success message
                showSuccessMessage(contactForm);
                contactForm.reset();
            } else {
                // Focus first error field
                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
            }
        });
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#EF4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '4px';
        field.parentElement.appendChild(errorDiv);
    }

    function showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <p style="color: var(--color-accent-green); font-weight: 600; padding: 16px; background: #F0FDF4; border-radius: 8px; margin-top: 16px;">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
            </p>
        `;
        
        // Remove existing success message if any
        const existingSuccess = form.querySelector('.form-success');
        if (existingSuccess) existingSuccess.remove();
        
        form.appendChild(successDiv);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }

    // Initialize contact form if present
    initContactForm();

    /* ====================================
       COPY TO CLIPBOARD (for contact page email)
       ==================================== */
    
    function initCopyToClipboard() {
        const copyButtons = document.querySelectorAll('[data-copy]');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const textToCopy = button.getAttribute('data-copy');
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    
                    // Show feedback
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = 'var(--color-accent-green)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy Email';
                    }, 2000);
                }
            });
        });
    }

    initCopyToClipboard();

    /* ====================================
       PRICING TOGGLE (for pricing page - will be used later)
       ==================================== */
    
    function initPricingToggle() {
        const toggle = document.getElementById('pricingToggle');
        
        if (!toggle) return;

        toggle.addEventListener('change', () => {
            const isAnnual = toggle.checked;
            const prices = document.querySelectorAll('[data-monthly], [data-annual]');
            
            prices.forEach(priceElement => {
                const monthly = priceElement.getAttribute('data-monthly');
                const annual = priceElement.getAttribute('data-annual');
                
                if (monthly && annual) {
                    priceElement.textContent = isAnnual ? annual : monthly;
                }
            });

            // Update billing period labels
            const billingLabels = document.querySelectorAll('.billing-period');
            billingLabels.forEach(label => {
                label.textContent = isAnnual ? '/year' : '/month';
            });
        });
    }

    initPricingToggle();

    /* ====================================
       INITIALIZE ON DOM CONTENT LOADED
       ==================================== */
    
    // Reinitialize functions that might need it
    document.addEventListener('DOMContentLoaded', () => {
        // All initialization is already done above
        console.log('Catchnode website initialized');
    });

    /* ====================================
       PERFORMANCE: Lazy load images fallback
       ==================================== */
    
    // Modern browsers support native lazy loading, but here's a fallback
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        console.log('Native lazy loading supported');
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* ====================================
   SERVICES PAGE - ADDITIONAL JS
   ==================================== */

// Services page specific functionality (if needed in future)
// Currently, the services overview page uses the global navigation,
// smooth scroll, and reveal animations from main.js

// This section is reserved for any services-specific interactions
// such as service card filtering, comparison table interactions, etc.

// Example: Enhanced comparison table for mobile
function initComparisonTable() {
    const tableWrapper = document.querySelector('.comparison-table-wrapper');
    
    if (!tableWrapper) return;
    
    const table = tableWrapper.querySelector('.comparison-table');
    
    if (!table) return;
    
    // Add scroll hint for mobile
    let isScrolling = false;
    
    tableWrapper.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            tableWrapper.classList.add('is-scrolling');
            
            setTimeout(() => {
                isScrolling = false;
                tableWrapper.classList.remove('is-scrolling');
            }, 150);
        }
    });
    
    // Check if table needs scrolling on load and resize
    function checkTableScroll() {
        const needsScroll = table.scrollWidth > tableWrapper.clientWidth;
        tableWrapper.classList.toggle('needs-scroll', needsScroll);
    }
    
    checkTableScroll();
    window.addEventListener('resize', debounce(checkTableScroll, 250));
}

// Initialize comparison table enhancements
initComparisonTable();

// Apply reveal animations to service detail cards
const serviceDetailCards = document.querySelectorAll('.service-detail-card');
serviceDetailCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.2}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

// Apply reveal to comparison table
const comparisonSection = document.querySelector('.comparison-table-wrapper');
if (comparisonSection && typeof observer !== 'undefined') {
    comparisonSection.classList.add('reveal');
    observer.observe(comparisonSection);
}

// Note: The debounce function is already defined in main.js
// If this code is added to main.js, no need to redefine it




/* ====================================
   SERVICE SUBPAGES - ADDITIONAL JS
   ==================================== */

// Service subpages specific functionality
// Most interactions are handled by global JS (navigation, smooth scroll, etc.)

// Apply reveal animations to service page sections
function initServicePageAnimations() {
    // PSO Cards
    const psoCards = document.querySelectorAll('.pso-card');
    psoCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Feature Cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Example Cards
    const exampleCards = document.querySelectorAll('.example-card');
    exampleCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Metric Cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Testimonial Feature
    const testimonialFeature = document.querySelector('.testimonial-feature');
    if (testimonialFeature) {
        testimonialFeature.classList.add('reveal');
        observer.observe(testimonialFeature);
    }

    // Pricing Teaser
    const pricingTeaser = document.querySelector('.pricing-teaser');
    if (pricingTeaser) {
        pricingTeaser.classList.add('reveal');
        observer.observe(pricingTeaser);
    }

    // Service Hero Content
    const serviceHeroContent = document.querySelector('.service-hero__content');
    if (serviceHeroContent) {
        serviceHeroContent.classList.add('reveal');
        observer.observe(serviceHeroContent);
    }
}

// Initialize service page animations
initServicePageAnimations();

// Animate metric values on scroll into view (count-up effect)
function initMetricCountUp() {
    const metricValues = document.querySelectorAll('.metric-card__value');
    
    metricValues.forEach(metricValue => {
        // Only animate numeric values
        const text = metricValue.textContent.trim();
        const hasNumber = /\d/.test(text);
        
        if (!hasNumber) return;
        
        // Extract number from text (e.g., "95%" -> 95, "<15 min" -> 15)
        const matches = text.match(/(\d+)/);
        if (!matches) return;
        
        const targetNumber = parseInt(matches[0]);
        const prefix = text.split(matches[0])[0];
        const suffix = text.split(matches[0])[1];
        
        // Create intersection observer for count-up animation
        const countUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !metricValue.dataset.counted) {
                    metricValue.dataset.counted = 'true';
                    animateValue(metricValue, 0, targetNumber, 1500, prefix, suffix);
                    countUpObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        countUpObserver.observe(metricValue);
    });
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = prefix + Math.floor(current) + suffix;
    }, 16);
}

// Initialize metric count-up animations
initMetricCountUp();

/* ====================================
   AUTOMATION PAGE - ADDITIONAL JS
   ==================================== */

/* Note: All service subpage JavaScript was added in Step 9 (helpdesk.html JS)
   and applies globally to all service pages. The following functions are already
   active on the automation page:
   
   - initServicePageAnimations() - Applies reveal animations to PSO cards,
     feature cards, example cards, metric cards, testimonials, and pricing teaser
   - initMetricCountUp() - Animates metric values when they scroll into view
   
   No additional JavaScript needed for the automation page. All interactivity
   is inherited from the global main.js file. */

/* The automation page will automatically benefit from:
   - Staggered scroll reveal animations
   - Count-up effects on metrics (60%, 85%, etc.)
   - Smooth scrolling
   - Header navigation (hamburger menu, dropdowns)
   - Mobile menu functionality
   - All other global interactions */


/* ====================================
   CLOUD & CYBERSECURITY PAGE - ADDITIONAL JS
   ==================================== */

/* Note: All service subpage JavaScript was created in Step 9 and applies globally.
   The cloud & cybersecurity page automatically benefits from:
   
   - initServicePageAnimations() - Staggered reveal animations on all components
   - initMetricCountUp() - Animated counting for metrics (100%, 90%, <4hrs, etc.)
   
   No additional JavaScript needed. All interactivity is inherited from main.js */

/* The cloud page automatically gets:
   - ✅ Staggered scroll reveal animations on PSO cards, feature cards, examples, metrics
   - ✅ Count-up effects on metrics (100%, 90%, 24/7, <4 hrs)
   - ✅ Smooth scrolling for anchor links
   - ✅ Header navigation (dropdowns, hamburger menu)
   - ✅ Mobile menu functionality
   - ✅ All global interactions and animations */



/* ====================================
   PRICING PAGE - TOGGLE FUNCTIONALITY
   ==================================== */

// Pricing toggle is already initialized in main.js as initPricingToggle()
// This is already included in the global JS, but here's the implementation again for reference

// The function below is ALREADY in main.js from Step 3, so you don't need to add it again
// This is just documentation of what's already working

/*
function initPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isAnnual = toggle.checked;
        const prices = document.querySelectorAll('[data-monthly], [data-annual]');
        
        prices.forEach(priceElement => {
            const monthly = priceElement.getAttribute('data-monthly');
            const annual = priceElement.getAttribute('data-annual');
            
            if (monthly && annual) {
                // Add updating class for smooth transition
                priceElement.classList.add('updating');
                
                setTimeout(() => {
                    priceElement.textContent = isAnnual ? annual : monthly;
                    priceElement.classList.remove('updating');
                }, 150);
            }
        });

        // Update billing period labels if they exist
        const billingLabels = document.querySelectorAll('.billing-period');
        billingLabels.forEach(label => {
            label.textContent = isAnnual ? '/year' : '/month';
        });
    });
}

// This is already called in main.js, so the pricing toggle is already functional
initPricingToggle();
*/

// Apply reveal animations to pricing page sections
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const addonCards = document.querySelectorAll('.addon-card');
addonCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

// Apply reveal to comparison table
const pricingComparisonTable = document.querySelector('.pricing-comparison .comparison-table-wrapper');
if (pricingComparisonTable && typeof observer !== 'undefined') {
    pricingComparisonTable.classList.add('reveal');
    observer.observe(pricingComparisonTable);
}


/* ====================================
   CASE STUDIES PAGE - FILTERING
   ==================================== */

// Initialize case studies filtering
function initCaseFiltering() {
    const filterButtons = document.querySelectorAll('.cases-filter__btn');
    const caseCards = document.querySelectorAll('.case-card');
    
    if (filterButtons.length === 0 || caseCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('cases-filter__btn--active'));
            button.classList.add('cases-filter__btn--active');
            
            // Filter case cards
            caseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.classList.add('filtered-in');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        card.classList.remove('filtered-in');
                    }, 500);
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Scroll to cases grid smoothly
            const casesGrid = document.querySelector('.cases-grid');
            if (casesGrid && filterValue !== 'all') {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const filterHeight = document.querySelector('.cases-filter')?.offsetHeight || 0;
                const targetPosition = casesGrid.getBoundingClientRect().top + window.pageYOffset - headerHeight - filterHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize case studies filtering
initCaseFiltering();

// Apply reveal animations to case cards
const caseCards = document.querySelectorAll('.case-card');
caseCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

// Apply reveal to filter buttons
const casesFilter = document.querySelector('.cases-filter');
if (casesFilter && typeof observer !== 'undefined') {
    casesFilter.classList.add('reveal');
    observer.observe(casesFilter);
}


/* ====================================
   CASE STUDY TEMPLATE - ADDITIONAL JS
   ==================================== */

/* Note: Most case study functionality is handled by global JS.
   The case study page automatically benefits from:
   - Smooth scrolling for anchor links
   - Header navigation
   - Mobile menu
   - All global interactions
   
   This section adds reveal animations for case study-specific elements. */

// Apply reveal animations to case study sections
const caseStudyHeader = document.querySelector('.case-study-header__content');
if (caseStudyHeader && typeof observer !== 'undefined') {
    caseStudyHeader.classList.add('reveal');
    observer.observe(caseStudyHeader);
}

const resultStats = document.querySelectorAll('.result-stat');
resultStats.forEach((stat, index) => {
    stat.classList.add('reveal');
    stat.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(stat);
    }
});

const stepCards = document.querySelectorAll('.step-card');
stepCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const impactCards = document.querySelectorAll('.impact-card');
impactCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const caseStudyQuote = document.querySelector('.case-study-content__quote');
if (caseStudyQuote && typeof observer !== 'undefined') {
    caseStudyQuote.classList.add('reveal');
    observer.observe(caseStudyQuote);
}

const techStackCategories = document.querySelectorAll('.tech-stack__category');
techStackCategories.forEach((category, index) => {
    category.classList.add('reveal');
    category.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(category);
    }
});

// Animate result stat values with count-up effect (reuse from service pages)
// The initMetricCountUp function from Step 9 already handles .result-stat__value elements
// since they use similar structure to .metric-card__value

// Optional: Add smooth scroll to sections when clicking in-page links
const caseStudySections = document.querySelectorAll('.case-study-section');
caseStudySections.forEach(section => {
    // Sections are already handled by global smooth scroll functionality
    // No additional code needed
});


/* ====================================
   ABOUT PAGE - ADDITIONAL JS
   ==================================== */

/* Note: Most about page functionality is handled by global JS.
   The about page automatically benefits from:
   - Smooth scrolling
   - Header navigation
   - Mobile menu
   - All global interactions
   
   This section adds reveal animations for about-specific elements. */

// Apply reveal animations to about page sections
const aboutHeroContent = document.querySelector('.about-hero__content');
if (aboutHeroContent && typeof observer !== 'undefined') {
    aboutHeroContent.classList.add('reveal');
    observer.observe(aboutHeroContent);
}

const missionCards = document.querySelectorAll('.about-mission__card');
missionCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.2}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const valueCards = document.querySelectorAll('.value-card');
valueCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${index * 0.2}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(item);
    }
});

const leaderCards = document.querySelectorAll('.leader-card');
leaderCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.2}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});


/* ====================================
   CONTACT PAGE - ADDITIONAL JS
   ==================================== */

/* Note: Form validation and copy-to-clipboard are already handled in global JS.
   The initContactForm() and initCopyButtons() functions from Step 3 handle:
   - Email validation
   - Required field validation
   - Form submission
   - Copy email/phone functionality
   
   This section adds reveal animations for contact-specific elements. */

// Apply reveal animations to contact page sections
const contactHeroContent = document.querySelector('.contact-hero__content');
if (contactHeroContent && typeof observer !== 'undefined') {
    contactHeroContent.classList.add('reveal');
    observer.observe(contactHeroContent);
}

const contactFormWrapper = document.querySelector('.contact-form-wrapper');
if (contactFormWrapper && typeof observer !== 'undefined') {
    contactFormWrapper.classList.add('reveal');
    observer.observe(contactFormWrapper);
}

const contactSidebar = document.querySelector('.contact-sidebar');
if (contactSidebar && typeof observer !== 'undefined') {
    contactSidebar.classList.add('reveal');
    contactSidebar.style.transitionDelay = '0.2s';
    observer.observe(contactSidebar);
}

const contactInfoItems = document.querySelectorAll('.contact-info-item');
contactInfoItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(item);
    }
});

const responseTimeCard = document.querySelector('.response-time-card');
if (responseTimeCard && typeof observer !== 'undefined') {
    responseTimeCard.classList.add('reveal');
    responseTimeCard.style.transitionDelay = '0.3s';
    observer.observe(responseTimeCard);
}

// Add subtle animation to form inputs on focus
const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateX(4px)';
        this.parentElement.style.transition = 'transform 0.2s ease-out';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateX(0)';
    });
});

// Character counter for message textarea (optional enhancement)
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const maxLength = 1000;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = 'font-size: 0.875rem; color: #64748B; margin-top: 0.5rem; text-align: right;';
    messageTextarea.parentElement.appendChild(counter);
    
    // Update counter
    function updateCounter() {
        const remaining = maxLength - messageTextarea.value.length;
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 100) {
            counter.style.color = '#EF4444';
        } else {
            counter.style.color = '#64748B';
        }
    }
    
    // Set max length
    messageTextarea.setAttribute('maxlength', maxLength);
    
    // Initialize and listen for changes
    updateCounter();
    messageTextarea.addEventListener('input', updateCounter);
}


/* ====================================
   BLOG PAGE - FILTERING & NEWSLETTER
   ==================================== */

// Initialize blog filtering
function initBlogFiltering() {
    const filterButtons = document.querySelectorAll('.blog-filter__btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length === 0 || blogCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('blog-filter__btn--active'));
            button.classList.add('blog-filter__btn--active');
            
            // Filter blog cards
            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.classList.add('filtered-in');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        card.classList.remove('filtered-in');
                    }, 500);
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Scroll to blog grid smoothly
            const blogGrid = document.querySelector('.blog-grid');
            if (blogGrid && filterValue !== 'all') {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const filterHeight = document.querySelector('.blog-filter')?.offsetHeight || 0;
                const targetPosition = blogGrid.getBoundingClientRect().top + window.pageYOffset - headerHeight - filterHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize blog filtering
initBlogFiltering();

// Newsletter form submission
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            // Show error
            emailInput.style.borderColor = '#EF4444';
            return;
        }
        
        // Reset error state
        emailInput.style.borderColor = '';
        
        // Disable form during submission
        emailInput.disabled = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        // Simulate API call (replace with actual newsletter API)
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert--success';
            successMessage.style.cssText = 'margin-top: 1rem; padding: 1rem; background-color: #F0FDF4; border: 1px solid #10B981; border-radius: 8px; color: #065F46; text-align: center;';
            successMessage.textContent = '✓ Thanks for subscribing! Check your email to confirm.';
            
            newsletterForm.appendChild(successMessage);
            
            // Reset form
            newsletterForm.reset();
            emailInput.disabled = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe';
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1000);
    });
}

// Initialize newsletter form
initNewsletterForm();

// Apply reveal animations to blog page sections
const blogHeroContent = document.querySelector('.blog-hero__content');
if (blogHeroContent && typeof observer !== 'undefined') {
    blogHeroContent.classList.add('reveal');
    observer.observe(blogHeroContent);
}

const blogFilter = document.querySelector('.blog-filter');
if (blogFilter && typeof observer !== 'undefined') {
    blogFilter.classList.add('reveal');
    observer.observe(blogFilter);
}

const blogCards = document.querySelectorAll('.blog-card');
blogCards.forEach((card, index) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(card);
    }
});

const newsletterCta = document.querySelector('.newsletter-cta__content');
if (newsletterCta && typeof observer !== 'undefined') {
    newsletterCta.classList.add('reveal');
    observer.observe(newsletterCta);
}


/* ====================================
   BLOG POST TEMPLATE - ADDITIONAL JS
   ==================================== */

/* Note: Most blog post functionality is handled by global JS.
   The blog post page automatically benefits from:
   - Smooth scrolling for anchor links
   - Header navigation
   - Mobile menu
   - All global interactions
   
   This section adds reveal animations for blog post-specific elements. */

// Apply reveal animations to blog post sections
const blogPostHeader = document.querySelector('.blog-post-header__breadcrumb');
if (blogPostHeader && typeof observer !== 'undefined') {
    blogPostHeader.classList.add('reveal');
    observer.observe(blogPostHeader);
}

const blogPostTitle = document.querySelector('.blog-post-header__title');
if (blogPostTitle && typeof observer !== 'undefined') {
    blogPostTitle.classList.add('reveal');
    blogPostTitle.style.transitionDelay = '0.1s';
    observer.observe(blogPostTitle);
}

const blogPostAuthorHeader = document.querySelector('.blog-post-header__author');
if (blogPostAuthorHeader && typeof observer !== 'undefined') {
    blogPostAuthorHeader.classList.add('reveal');
    blogPostAuthorHeader.style.transitionDelay = '0.2s';
    observer.observe(blogPostAuthorHeader);
}

const blogPostFeatured = document.querySelector('.blog-post-featured img');
if (blogPostFeatured && typeof observer !== 'undefined') {
    blogPostFeatured.classList.add('reveal');
    observer.observe(blogPostFeatured);
}

const blogPostBody = document.querySelector('.blog-post-body');
if (blogPostBody && typeof observer !== 'undefined') {
    blogPostBody.classList.add('reveal');
    observer.observe(blogPostBody);
}

const authorBio = document.querySelector('.author-bio');
if (authorBio && typeof observer !== 'undefined') {
    authorBio.classList.add('reveal');
    observer.observe(authorBio);
}

const relatedPosts = document.querySelectorAll('.related-post');
relatedPosts.forEach((post, index) => {
    post.classList.add('reveal');
    post.style.transitionDelay = `${index * 0.15}s`;
    if (typeof observer !== 'undefined') {
        observer.observe(post);
    }
});

// Add reading progress indicator
function initReadingProgress() {
    const article = document.querySelector('.blog-post-content');
    if (!article) return;
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        z-index: 1000;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Initialize reading progress
initReadingProgress();

// Add smooth scroll for anchor links within article
const articleLinks = document.querySelectorAll('.blog-post-body a[href^="#"]');
articleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add copy button to code blocks (if any exist in future posts)
const codeBlocks = document.querySelectorAll('.blog-post-body pre code');
codeBlocks.forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.textContent = 'Copy';
    copyButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease-out;
    `;
    
    pre.style.position = 'relative';
    pre.appendChild(copyButton);
    
    pre.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
    });
    
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
});

})();



