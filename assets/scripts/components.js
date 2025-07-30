// assets/js/components.js

/**
 * Lumomire UI Components
 * Advanced component behaviors and animations
 * Restored original functionality with navy + gold theme
 */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.animationFrame = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.registerComponents();
        this.initializeAnimations();
        this.setupIntersectionObservers();
        this.isInitialized = true;
    }

    registerComponents() {
        // Register all component types
        this.components.set('pricing-card', new PricingCardComponent());
        this.components.set('dashboard-preview', new DashboardPreviewComponent());
        this.components.set('feature-card', new FeatureCardComponent());
        this.components.set('form-validator', new FormValidatorComponent());
        this.components.set('scroll-animator', new ScrollAnimatorComponent());
        this.components.set('performance-monitor', new PerformanceMonitorComponent());
    }

    getComponent(name) {
        return this.components.get(name);
    }

    initializeAnimations() {
        // Initialize CSS custom properties for animations
        document.documentElement.style.setProperty('--animation-duration', '300ms');
        document.documentElement.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        
        // Add animation styles if not present
        this.injectAnimationStyles();
    }

    injectAnimationStyles() {
        const styleId = 'lumomire-animations';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes goldGlow {
                0%, 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.3); }
                50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.6); }
            }
            
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }
            
            .animate-scale-in {
                animation: scaleIn 0.3s ease-out;
            }
            
            .animate-shimmer::after {
                animation: shimmer 2s infinite;
            }
            
            .animate-gold-glow {
                animation: goldGlow 2s ease-in-out infinite;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupIntersectionObservers() {
        // Animate elements when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe animatable elements
        const animatableElements = document.querySelectorAll('.feature, .pricing-card, .metric-card');
        animatableElements.forEach(el => observer.observe(el));
    }
}

/**
 * Pricing Card Component
 * Handles pricing interactions and animations with original gold theme
 */
class PricingCardComponent {
    constructor() {
        this.cards = document.querySelectorAll('.pricing-card');
        this.toggle = document.getElementById('pricing-toggle');
        this.amounts = document.querySelectorAll('.pricing-card__amount');
        
        this.bindEvents();
    }

    bindEvents() {
        // Pricing toggle animation with gold theme
        if (this.toggle) {
            this.toggle.addEventListener('change', (e) => {
                this.animatePriceChange(e.target.checked);
            });
        }

        // Card hover effects with navy/gold theme
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onCardHover(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
        });

        // Button interactions
        this.cards.forEach(card => {
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', () => this.onButtonClick(card, button));
            }
        });
    }

    animatePriceChange(isAnnual) {
        this.amounts.forEach((amount, index) => {
            // Stagger the animation with gold glow
            setTimeout(() => {
                amount.style.transform = 'scale(1.1)';
                amount.style.color = '#f1c40f'; // Brighter gold during animation
                amount.classList.add('animate-gold-glow');
                
                setTimeout(() => {
                    const monthly = amount.getAttribute('data-monthly');
                    const annual = amount.getAttribute('data-annual');
                    
                    if (monthly && annual) {
                        amount.textContent = isAnnual ? annual : monthly;
                    }
                    
                    setTimeout(() => {
                        amount.style.transform = 'scale(1)';
                        amount.style.color = '#d4af37'; // Original gold
                        amount.classList.remove('animate-gold-glow');
                    }, 100);
                }, 150);
            }, index * 100);
        });
    }

    onCardHover(card) {
        // Add gold glow effect
        card.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.15)';
        card.style.borderColor = '#d4af37';
        
        // Animate features list
        const features = card.querySelectorAll('.features-list__item');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(8px)';
                feature.style.color = '#374151'; // Primary text color
            }, index * 50);
        });

        // Animate check icons to gold
        const checkIcons = card.querySelectorAll('.check-icon');
        checkIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.color = '#f1c40f';
                icon.style.transform = 'scale(1.2)';
            }, index * 30);
        });
    }

    onCardLeave(card) {
        // Remove glow effect
        card.style.boxShadow = '';
        card.style.borderColor = '';
        
        // Reset features list
        const features = card.querySelectorAll('.features-list__item');
        features.forEach(feature => {
            feature.style.transform = 'translateX(0)';
            feature.style.color = '#6b7280'; // Secondary text color
        });

        // Reset check icons
        const checkIcons = card.querySelectorAll('.check-icon');
        checkIcons.forEach(icon => {
            icon.style.color = '#d4af37';
            icon.style.transform = 'scale(1)';
        });
    }

    onButtonClick(card, button) {
        // Button click animation with navy/gold theme
        button.style.transform = 'scale(0.95)';
        button.style.background = '#0f172a'; // Dark navy during click
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = '';
        }, 150);

        // Card selection effect
        card.classList.add('animate-scale-in');
        setTimeout(() => {
            card.classList.remove('animate-scale-in');
        }, 300);
    }
}

/**
 * Dashboard Preview Component
 * Handles dashboard cycling and interactions with navy/gold theme
 */
class DashboardPreviewComponent {
    constructor() {
        this.container = document.getElementById('dashboard-preview');
        this.toggles = document.querySelectorAll('.dashboard-toggle');
        this.slides = document.querySelectorAll('.dashboard-slide');
        this.currentIndex = 1; // Start with CFO dashboard (index 1)
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.bindEvents();
        this.startAutoPlay();
        this.setupTouchGestures();
        this.setupDashboardData();
    }

    setupDashboardData() {
        // Add some dynamic data animation to make dashboards feel alive
        setInterval(() => {
            this.animateMetricValues();
        }, 3000);
    }

    animateMetricValues() {
        if (document.hidden) return;

        const activeSlide = document.querySelector('.dashboard-slide.active');
        if (!activeSlide) return;

        const metricValues = activeSlide.querySelectorAll('.metric-value');
        metricValues.forEach(value => {
            value.style.color = '#f1c40f'; // Bright gold
            value.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                value.style.color = '#d4af37'; // Original gold
                value.style.transform = 'scale(1)';
            }, 500);
        });
    }

    bindEvents() {
        this.toggles.forEach((toggle, index) => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTo(index);
                this.pauseAutoPlay();
                
                // Resume autoplay after user interaction
                setTimeout(() => this.resumeAutoPlay(), 5000);
            });
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    switchTo(index) {
        if (index === this.currentIndex) return;

        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];
        const currentToggle = this.toggles[this.currentIndex];
        const nextToggle = this.toggles[index];

        // Animate out current slide
        if (currentSlide) {
            currentSlide.style.transform = 'translateX(-100%)';
            currentSlide.style.opacity = '0';
            setTimeout(() => {
                currentSlide.classList.remove('active');
            }, 300);
        }

        // Animate in next slide
        if (nextSlide) {
            nextSlide.style.transform = 'translateX(100%)';
            nextSlide.style.opacity = '0';
            nextSlide.classList.add('active');
            
            setTimeout(() => {
                nextSlide.style.transform = 'translateX(0)';
                nextSlide.style.opacity = '1';
            }, 50);
        }

        // Update toggles with gold accent
        if (currentToggle) {
            currentToggle.classList.remove('active');
            currentToggle.style.background = '';
            currentToggle.style.color = '';
        }
        if (nextToggle) {
            nextToggle.classList.add('active');
            nextToggle.style.background = '#d4af37';
            nextToggle.style.color = 'white';
        }

        this.currentIndex = index;
        this.animateMetrics(nextSlide);
    }

    animateMetrics(slide) {
        const metrics = slide.querySelectorAll('.metric-card');
        metrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.style.transform = 'scale(1.02)';
                metric.style.borderColor = '#d4af37';
                
                setTimeout(() => {
                    metric.style.transform = 'scale(1)';
                    metric.style.borderColor = '';
                }, 300);
            }, index * 150);
        });
    }

    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (document.hidden) return; // Don't animate hidden tabs
            
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.switchTo(nextIndex);
        }, 4000);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
        this.startAutoPlay();
    }

    setupTouchGestures() {
        if (!('ontouchstart' in window)) return;

        let startX = 0;
        let startY = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                const nextIndex = deltaX > 0 
                    ? (this.currentIndex - 1 + this.slides.length) % this.slides.length
                    : (this.currentIndex + 1) % this.slides.length;
                
                this.switchTo(nextIndex);
                this.pauseAutoPlay();
                setTimeout(() => this.resumeAutoPlay(), 5000);
            }
        }, { passive: true });
    }
}

/**
 * Feature Card Component
 * Handles feature card animations with navy/gold theme
 */
class FeatureCardComponent {
    constructor() {
        this.cards = document.querySelectorAll('.feature');
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onCardEnter(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
        });
    }

    onCardEnter(card) {
        // Icon animation with navy/gold gradient
        const icon = card.querySelector('.feature__icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.background = 'linear-gradient(135deg, #1a365d 0%, #d4af37 100%)';
        }

        // Title color change to navy
        const title = card.querySelector('.feature__title');
        if (title) {
            title.style.color = '#1a365d';
        }

        // Stagger list item animations with gold accents
        const listItems = card.querySelectorAll('.feature__list li');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(10px)';
                item.style.color = '#374151'; // Primary text color
                
                // Make checkmarks gold
                const checkmark = item.querySelector('::before');
                item.style.setProperty('--check-color', '#d4af37');
            }, index * 50);
        });

        // Add gold border gradient
        card.style.borderImage = 'linear-gradient(45deg, #d4af37, #f1c40f) 1';
    }

    onCardLeave(card) {
        // Reset icon
        const icon = card.querySelector('.feature__icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.background = 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)';
        }

        // Reset title
        const title = card.querySelector('.feature__title');
        if (title) {
            title.style.color = '#374151';
        }

        // Reset list items
        const listItems = card.querySelectorAll('.feature__list li');
        listItems.forEach(item => {
            item.style.transform = 'translateX(0)';
            item.style.color = '#6b7280';
        });

        // Reset border
        card.style.borderImage = '';
    }
}

/**
 * Form Validator Component
 * Advanced form validation with navy/gold theme
 */
class FormValidatorComponent {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.initializeForms();
    }

    initializeForms() {
        this.forms.forEach(form => {
            this.setupFormValidation(form);
            this.enhanceFormUX(form);
        });
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    enhanceFormUX(form) {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            // Add floating label effect with gold accent
            input.addEventListener('focus', () => this.onFieldFocus(input));
            input.addEventListener('blur', () => this.onFieldBlur(input));
            
            // Real-time character counter for text areas
            if (input.tagName === 'TEXTAREA') {
                this.addCharacterCounter(input);
            }
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let message = '';

        switch (type) {
            case 'email':
                isValid = this.isValidEmail(value);
                message = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'text':
                if (input.required) {
                    isValid = value.length > 0;
                    message = isValid ? '' : 'This field is required';
                }
                break;
        }

        if (isValid) {
            this.clearFieldError(input);
            this.showFieldSuccess(input);
        } else {
            this.showFieldError(input, message);
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('field-error');
        input.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            opacity: 0;
            animation: fadeInUp 0.3s ease forwards;
        `;
        
        input.parentNode.appendChild(errorElement);
    }

    showFieldSuccess(input) {
        input.classList.add('field-success');
        input.style.borderColor = '#d4af37'; // Gold for success
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.classList.remove('field-success');
        }, 2000);
    }

    clearFieldError(input) {
        input.classList.remove('field-error');
        input.style.borderColor = '';
        const errorElement = input.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    onFieldFocus(input) {
        input.parentNode.classList.add('field-focused');
        input.style.borderColor = '#d4af37'; // Gold focus
        input.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
    }

    onFieldBlur(input) {
        input.parentNode.classList.remove('field-focused');
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        if (!input.value.trim()) {
            input.parentNode.classList.remove('field-filled');
        } else {
            input.parentNode.classList.add('field-filled');
        }
    }

    addCharacterCounter(textarea) {
        const maxLength = textarea.getAttribute('maxlength');
        if (!maxLength) return;

        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: #9ca3af;
            margin-top: 0.25rem;
        `;
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 20 ? '#ef4444' : remaining < 50 ? '#d4af37' : '#9ca3af';
        };

        textarea.addEventListener('input', updateCounter);
        updateCounter();
        
        textarea.parentNode.appendChild(counter);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Scroll Animator Component
 * Handles scroll-based animations with navy/gold accents
 */
class ScrollAnimatorComponent {
    constructor() {
        this.scrollElements = document.querySelectorAll('[data-scroll-animation]');
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupParallaxScrolling();
        this.setupNavyGoldEffects();
    }

    setupNavyGoldEffects() {
        // Add special effects for navy/gold theme elements
        const goldElements = document.querySelectorAll('.metric-value, .pricing-card__amount');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.color = '#f1c40f'; // Bright gold
                    setTimeout(() => {
                        entry.target.style.color = '#d4af37'; // Original gold
                    }, 1000);
                }
            });
        }, { threshold: 0.5 });

        goldElements.forEach(el => observer.observe(el));
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.getAttribute('data-scroll-animation');
                    this.animateElement(entry.target, animation);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        this.scrollElements.forEach(el => observer.observe(el));
    }

    animateElement(element, animation) {
        switch (animation) {
            case 'fadeInUp':
                element.style.cssText = `
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
                break;
                
            case 'slideInLeft':
                element.style.cssText = `
                    opacity: 0;
                    transform: translateX(-50px);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;
                
            case 'scaleIn':
                element.style.cssText = `
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                }, 100);
                break;
                
            case 'goldGlow':
                element.classList.add('animate-gold-glow');
                setTimeout(() => {
                    element.classList.remove('animate-gold-glow');
                }, 2000);
                break;
        }
    }

    setupParallaxScrolling() {
        if (this.parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.scrollY;
            
            this.parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
}

/**
 * Performance Monitor Component
 * Monitors component performance with enhanced navy/gold theme logging
 */
class PerformanceMonitorComponent {
    constructor() {
        this.metrics = {
            componentLoadTime: 0,
            animationFrames: 0,
            memoryUsage: 0,
            themeTransitions: 0
        };
        
        this.init();
    }

    init() {
        this.measureComponentLoadTime();
        this.monitorAnimationPerformance();
        this.trackMemoryUsage();
        this.monitorThemePerformance();
    }

    measureComponentLoadTime() {
        const startTime = performance.now();
        
        // Measure when all components are loaded
        requestAnimationFrame(() => {
            this.metrics.componentLoadTime = performance.now() - startTime;
            
            if (this.metrics.componentLoadTime > 100) {
                console.warn(`[ComponentManager] Components took ${this.metrics.componentLoadTime.toFixed(2)}ms to load`);
            } else {
                console.log(`[ComponentManager] Components loaded in ${this.metrics.componentLoadTime.toFixed(2)}ms`);
            }
        });
    }

    monitorAnimationPerformance() {
        let frameCount = 0;
        let startTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            this.metrics.animationFrames = frameCount;
            
            if (performance.now() - startTime > 1000) {
                const fps = frameCount;
                frameCount = 0;
                startTime = performance.now();
                
                if (fps < 30) {
                    console.warn(`[ComponentManager] Low FPS detected: ${fps} (Navy/Gold animations may be impacted)`);
                }
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    monitorThemePerformance() {
        // Monitor navy/gold theme transitions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this.metrics.themeTransitions++;
                }
            });
        });

        // Observe theme-sensitive elements
        const themeElements = document.querySelectorAll('.pricing-card, .feature, .dashboard-toggle');
        themeElements.forEach(el => {
            observer.observe(el, { attributes: true, attributeFilter: ['style'] });
        });
    }

    trackMemoryUsage() {
        if (!('memory' in performance)) return;
        
        setInterval(() => {
            const memory = performance.memory;
            this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
            
            if (this.metrics.memoryUsage > 50) {
                console.warn(`[ComponentManager] High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
            }
        }, 30000); // Check every 30 seconds
    }

    getMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            theme: 'navy-gold-original'
        };
    }
}

// Initialize component manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.ComponentManager = new ComponentManager();
        console.log('[ComponentManager] Initialized successfully with navy/gold theme');
        
        // Log theme confirmation
        console.log('[Lumomire] Original navy + gold color scheme restored');
    } catch (error) {
        console.error('[ComponentManager] Failed to initialize:', error);
    }
});

// Export for potential external use
window.LumomireComponents = {
    ComponentManager,
    PricingCardComponent,
    DashboardPreviewComponent,
    FeatureCardComponent,
    FormValidatorComponent,
    ScrollAnimatorComponent,
    PerformanceMonitorComponent
};

// Theme validation on load
window.addEventListener('load', () => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--primary').trim();
    const accentColor = rootStyles.getPropertyValue('--accent').trim();
    
    if (primaryColor === '#1a365d' && accentColor === '#d4af37') {
        console.log('✅ [Lumomire] Original navy + gold theme confirmed');
    } else {
        console.warn('⚠️ [Lumomire] Theme colors may not be properly restored');
    }
});