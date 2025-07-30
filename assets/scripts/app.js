// assets/scripts/app.js - COMPLETE LUMOMIRE LANDING PAGE APPLICATION

/**
 * Lumomire Landing Page Application
 * Production-ready JavaScript for static deployment with integrated pricing toggle
 */

class LumomireApp {
    constructor() {
        this.config = {
            // Environment-based URLs (static version)
            urls: {
                development: {
                    app: 'http://localhost:3000',
                    api: 'http://localhost:3000/api'
                },
                staging: {
                    app: 'https://app-staging.lumomire.com',
                    api: 'https://api-staging.lumomire.com'
                },
                production: {
                    app: 'https://app.lumomire.com',
                    api: 'https://api.lumomire.com'
                }
            },
            animationDuration: 300,
            debounceDelay: 150,
            scrollThreshold: 100,
            formSubmitUrl: '/contact'
        };
        
        this.state = {
            isMenuOpen: false,
            currentDashboard: 'cfo',
            isAnnualPricing: false,
            scrollPosition: 0,
            isLoaded: false,
            environment: this.getEnvironment()
        };
        
        this.elements = {};
        this.observers = new Map();
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.cacheElements();
            this.bindEvents();
            this.initializeComponents();
            this.startPerformanceMonitoring();
            this.state.isLoaded = true;
            
            console.log('[Lumomire] Application initialized successfully');
        } catch (error) {
            this.handleError('Failed to initialize application', error);
        }
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Navigation
            header: document.getElementById('header'),
            navLogo: document.getElementById('nav-logo'),
            navToggle: document.getElementById('nav-toggle'),
            navClose: document.getElementById('nav-close'),
            navMenu: document.getElementById('nav-menu'),
            navLinks: document.querySelectorAll('.nav__link'),
            
            // CTA Buttons
            scheduleDemo: document.getElementById('schedule-demo'),
            signIn: document.getElementById('sign-in'),
            startTrial: document.getElementById('start-trial'),
            watchDemo: document.getElementById('watch-demo'),
            
            // Dashboard
            dashboardToggles: document.querySelectorAll('.dashboard-toggle'),
            dashboardSlides: document.querySelectorAll('.dashboard-slide'),
            
            // Pricing
            pricingToggle: document.getElementById('pricing-toggle'),
            pricingAmounts: document.querySelectorAll('.pricing-card__amount'),
            pricingButtons: document.querySelectorAll('[data-plan]'),
            billingTexts: document.querySelectorAll('.pricing-card__billing'),
            purchaseLinks: document.querySelectorAll('.pricing-card__purchase-link'),
            
            // Form
            contactForm: document.getElementById('contact-form'),
            submitForm: document.getElementById('submit-form'),
            
            // All action buttons
            actionButtons: document.querySelectorAll('[data-action], [data-plan]'),
            
            // Sections
            sections: document.querySelectorAll('section[id]'),
            
            // Body
            body: document.body
        };
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        this.bindNavigationEvents();
        this.bindCTAEvents();
        this.bindDashboardEvents();
        this.bindPricingEvents();
        this.bindFormEvents();
        this.bindScrollEvents();
        this.bindUtilityEvents();
    }

    /**
     * Navigation event bindings
     */
    bindNavigationEvents() {
        // Logo click
        if (this.elements.navLogo) {
            this.elements.navLogo.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
                this.trackEvent('Navigation', 'Logo Click');
            });
        }

        // Mobile menu toggle
        if (this.elements.navToggle) {
            this.elements.navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        if (this.elements.navClose) {
            this.elements.navClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
            });
        }

        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    this.closeMobileMenu();
                    this.trackEvent('Navigation', 'Section Click', { section: href });
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && 
                !this.elements.navMenu?.contains(e.target) && 
                !this.elements.navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * CTA event bindings for all button types
     */
    bindCTAEvents() {
        // Handle header buttons
        if (this.elements.scheduleDemo) {
            this.elements.scheduleDemo.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick('demo', null, e.target);
            });
        }

        if (this.elements.signIn) {
            this.elements.signIn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick('signin', null, e.target);
            });
        }

        if (this.elements.startTrial) {
            this.elements.startTrial.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick('signup', null, e.target);
            });
        }

        if (this.elements.watchDemo) {
            this.elements.watchDemo.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick('video-demo', null, e.target);
            });
        }

        // Handle all data-action buttons
        this.elements.actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.getAttribute('data-action');
                const plan = button.getAttribute('data-plan');
                
                // If no action but has plan, assume signup
                const finalAction = action || 'signup-plan';
                
                this.handleCTAClick(finalAction, plan, button);
            });
        });
    }

    /**
     * Handle CTA clicks with static landing page actions
     */
    handleCTAClick(action, plan = null, button = null) {
        // Add loading state
        if (button) {
            this.setButtonLoading(button, true);
            
            // Remove loading state after action
            setTimeout(() => {
                this.setButtonLoading(button, false);
            }, 1500);
        }

        switch (action) {
            case 'signin':
                this.redirectToSignIn();
                break;
            case 'signup':
                this.redirectToSignup();
                break;
            case 'signup-plan':
                this.redirectToSignup(plan);
                break;
            case 'demo':
                this.redirectToDemo();
                break;
            case 'video-demo':
                this.openVideoDemo();
                break;
            case 'contact-sales':
                this.redirectToContactSales();
                break;
            default:
                console.warn(`Unknown CTA action: ${action}`);
                if (button) {
                    this.setButtonLoading(button, false);
                }
        }

        // Track the action
        this.trackEvent('CTA', 'Click', { 
            action, 
            plan: plan || 'none',
            button_text: button?.textContent.trim() || 'unknown'
        });
    }

    /**
     * Redirect methods for static landing page
     */
    redirectToSignIn() {
        // Show coming soon message and scroll to contact
        this.showNotification('Sign in portal coming soon! Please contact us for early access.', 'info');
        
        // Delay scroll to let notification show
        setTimeout(() => {
            this.smoothScrollTo('#contact');
        }, 500);
        
        // Pre-fill the interest dropdown
        setTimeout(() => {
            const interestSelect = document.getElementById('interest');
            if (interestSelect) {
                interestSelect.value = 'trial';
            }
        }, 800);
        
        this.trackEvent('CTA', 'Sign In Interest');
    }

    redirectToSignup(plan = null) {
        // Determine message based on plan
        let message = 'Free trial signup coming soon!';
        if (plan) {
            const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
            message = `${planName} plan signup coming soon!`;
        }
        
        this.showNotification(message + ' Please fill out the form below.', 'info');
        
        // Delay scroll to let notification show
        setTimeout(() => {
            this.smoothScrollTo('#contact');
        }, 500);
        
        // Pre-fill the contact form based on plan
        setTimeout(() => {
            const interestSelect = document.getElementById('interest');
            if (interestSelect) {
                if (plan === 'enterprise') {
                    interestSelect.value = 'enterprise';
                } else {
                    interestSelect.value = 'trial';
                }
            }
        }, 800);
        
        this.trackEvent('CTA', 'Signup Interest', { 
            plan: plan || 'trial',
            source: 'button_click'
        });
    }

    redirectToDemo() {
        this.showNotification('Demo scheduling coming soon! Please request a demo below.', 'info');
        
        setTimeout(() => {
            this.smoothScrollTo('#contact');
        }, 500);
        
        // Pre-fill for demo request
        setTimeout(() => {
            const interestSelect = document.getElementById('interest');
            if (interestSelect) {
                interestSelect.value = 'demo';
            }
        }, 800);
        
        this.trackEvent('CTA', 'Demo Interest');
    }

    redirectToContactSales() {
        this.showNotification('Our sales team will contact you soon! Please fill out the form below.', 'info');
        
        setTimeout(() => {
            this.smoothScrollTo('#contact');
        }, 500);
        
        // Pre-fill for enterprise/sales inquiry
        setTimeout(() => {
            const interestSelect = document.getElementById('interest');
            if (interestSelect) {
                interestSelect.value = 'enterprise';
            }
        }, 800);
        
        this.trackEvent('CTA', 'Sales Interest');
    }

    openVideoDemo() {
        this.showNotification('Video demo coming soon! Please request a live demo below.', 'info');
        
        setTimeout(() => {
            this.smoothScrollTo('#contact');
        }, 500);
        
        // Pre-fill for demo
        setTimeout(() => {
            const interestSelect = document.getElementById('interest');
            if (interestSelect) {
                interestSelect.value = 'demo';
            }
        }, 800);
        
        this.trackEvent('CTA', 'Video Demo Interest');
    }

    /**
     * Get environment-appropriate URLs
     */
    getAppUrl() {
        return this.config.urls[this.state.environment].app;
    }

    getApiUrl() {
        return this.config.urls[this.state.environment].api;
    }

    getEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return 'development';
        } else if (hostname.includes('staging')) {
            return 'staging';
        }
        return 'production';
    }

    /**
     * Dashboard event bindings
     */
    bindDashboardEvents() {
        this.elements.dashboardToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dashboardType = toggle.getAttribute('data-dashboard');
                this.switchDashboard(dashboardType);
                this.trackEvent('Dashboard', 'Toggle', { type: dashboardType });
            });
        });

        // Auto-cycle dashboard on desktop
        if (window.innerWidth > 768) {
            this.startDashboardCycle();
        }
    }

    /**
     * Dashboard switching logic
     */
    switchDashboard(type) {
        // Update toggles
        this.elements.dashboardToggles.forEach(toggle => {
            toggle.classList.toggle('active', toggle.getAttribute('data-dashboard') === type);
        });

        // Update slides
        this.elements.dashboardSlides.forEach(slide => {
            slide.classList.toggle('active', slide.id === `dashboard-${type}`);
        });

        this.state.currentDashboard = type;
    }

    startDashboardCycle() {
        const dashboards = ['admin', 'cfo', 'member'];
        let currentIndex = dashboards.indexOf(this.state.currentDashboard);
        
        setInterval(() => {
            if (document.hidden) return; // Don't cycle when tab is hidden
            
            currentIndex = (currentIndex + 1) % dashboards.length;
            this.switchDashboard(dashboards[currentIndex]);
        }, 4000);
    }

    /**
     * UPDATED: Pricing event bindings - Always shows /month
     */
    bindPricingEvents() {
        if (this.elements.pricingToggle) {
            this.elements.pricingToggle.addEventListener('change', (e) => {
                this.togglePricing(e.target.checked);
                this.trackEvent('Pricing', 'Toggle', { isAnnual: e.target.checked });
            });
        }

        // Handle signup buttons with billing cycle
        const signupButtons = document.querySelectorAll('[data-action^="signup"]');
        signupButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const plan = button.getAttribute('data-plan');
                const isAnnual = this.elements.pricingToggle && this.elements.pricingToggle.checked;
                const billingCycle = isAnnual ? 'annual' : 'monthly';
                
                // Track with billing info
                this.trackEvent('CTA', 'Signup Button', { 
                    plan: plan || 'unknown',
                    billing: billingCycle
                });
            });
        });

        // Handle purchase links with billing cycle
        this.elements.purchaseLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const isAnnual = this.elements.pricingToggle && this.elements.pricingToggle.checked;
                const billingCycle = isAnnual ? 'annual' : 'monthly';
                
                // Extract plan from href
                const urlParams = new URLSearchParams(href.split('?')[1] || '');
                const plan = urlParams.get('plan') || 'unknown';
                
                // Add billing cycle to the URL
                const url = new URL(href, window.location.origin);
                url.searchParams.set('billing', billingCycle);
                
                this.trackEvent('CTA', 'Purchase Link', { 
                    plan: plan,
                    billing: billingCycle
                });
                
                // Show coming soon message instead of redirect
                this.redirectToSignup(plan);
            });
        });
    }

    /**
     * FIXED: Pricing toggle logic - Always shows /month
     */
    togglePricing(isAnnual) {
        this.state.isAnnualPricing = isAnnual;
        
        // Update pricing amounts ONLY
        this.elements.pricingAmounts.forEach(amount => {
            const monthly = amount.getAttribute('data-monthly');
            const annual = amount.getAttribute('data-annual');
            
            if (monthly && annual) {
                // Add animation
                amount.style.transform = 'scale(1.05)';
                amount.style.transition = 'transform 0.2s ease';
                
                setTimeout(() => {
                    amount.textContent = isAnnual ? annual : monthly;
                    amount.style.transform = 'scale(1)';
                }, 100);
            }
        });

        // Update billing text ONLY (not period text)
        this.elements.billingTexts.forEach(billingText => {
            const monthlyText = billingText.getAttribute('data-monthly-text');
            const annualText = billingText.getAttribute('data-annual-text');
            
            if (isAnnual && annualText) {
                billingText.textContent = annualText;
            } else if (monthlyText) {
                billingText.textContent = monthlyText;
            }
        });

        // CRITICAL: NEVER CHANGE THE PERIOD TEXT - IT STAYS "/month" ALWAYS
        // No code here that touches .pricing-card__period elements
    }

    /**
     * Form event bindings
     */
    bindFormEvents() {
        if (this.elements.contactForm) {
            this.elements.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e);
            });
        }
    }

    /**
     * Handle form submission for static landing page
     */
    async handleFormSubmission(e) {
        try {
            const formData = new FormData(this.elements.contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate form
            if (!this.validateForm(data)) {
                return;
            }

            // Show loading state
            this.setFormLoading(true);

            // Simulate form processing (since we don't have a backend yet)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Determine success message based on interest
            let successMessage = 'Thank you! We\'ll contact you soon.';
            switch (data.interest) {
                case 'trial':
                    successMessage = 'Thank you! We\'ll notify you when trial signup is available.';
                    break;
                case 'demo':
                    successMessage = 'Thank you! We\'ll schedule your demo soon.';
                    break;
                case 'enterprise':
                    successMessage = 'Thank you! Our sales team will contact you within 24 hours.';
                    break;
                case 'pricing':
                    successMessage = 'Thank you! We\'ll send you detailed pricing information.';
                    break;
                case 'migration':
                    successMessage = 'Thank you! Our migration specialist will contact you soon.';
                    break;
            }

            // Track successful form submission
            this.trackEvent('Form', 'Submit Success', {
                interest: data.interest || 'general',
                team_size: data['team-size'] || 'unknown',
                has_company: !!data.company,
                source: 'contact_form'
            });

            // Show success message
            this.showFormSuccess(successMessage);
            
            // Reset form after short delay
            setTimeout(() => {
                this.elements.contactForm.reset();
                this.setFormLoading(false);
            }, 2000);

        } catch (error) {
            this.handleError('Form submission failed', error);
            this.showFormError('Something went wrong. Please try again.');
            this.setFormLoading(false);
        }
    }

    /**
     * Form validation
     */
    validateForm(data) {
        const errors = [];
        
        if (!data.name?.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email?.trim() || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }
        
        if (errors.length > 0) {
            this.showFormError(errors.join(', '));
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Scroll event bindings
     */
    bindScrollEvents() {
        const throttledScrollHandler = this.throttle(() => {
            this.handleScroll();
        }, 16); // 60fps

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        this.initializeScrollObserver();
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        this.state.scrollPosition = scrollY;

        // Header scroll effect
        if (this.elements.header) {
            this.elements.header.classList.toggle('scroll-header', scrollY >= this.config.scrollThreshold);
        }
    }

    /**
     * Initialize scroll observer for section highlighting
     */
    initializeScrollObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -60% 0px'
        });

        this.elements.sections.forEach(section => {
            observer.observe(section);
        });

        this.observers.set('sections', observer);
    }

    updateActiveNavLink(sectionId) {
        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${sectionId}`);
        });
    }

    /**
     * Utility event bindings
     */
    bindUtilityEvents() {
        // Window resize
        const throttledResizeHandler = this.throttle(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', throttledResizeHandler);

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    handleResize() {
        if (window.innerWidth > 768 && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.trackEvent('Page', 'Hidden');
        } else {
            this.trackEvent('Page', 'Visible');
        }
    }

    /**
     * Mobile menu methods
     */
    toggleMobileMenu() {
        if (this.state.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.elements.navMenu?.classList.add('show-menu');
        this.elements.body.style.overflow = 'hidden';
        this.state.isMenuOpen = true;
        this.trackEvent('Navigation', 'Mobile Menu Opened');
    }

    closeMobileMenu() {
        this.elements.navMenu?.classList.remove('show-menu');
        this.elements.body.style.overflow = '';
        this.state.isMenuOpen = false;
    }

    /**
     * Smooth scrolling
     */
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const headerHeight = this.elements.header?.offsetHeight || 70;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize components
     */
    initializeComponents() {
        this.initializePricing();
        this.initializeDashboard();
    }

    initializePricing() {
        this.togglePricing(this.state.isAnnualPricing);
    }

    initializeDashboard() {
        this.switchDashboard(this.state.currentDashboard);
    }

    /**
     * UI helper methods
     */
    setButtonLoading(button, loading) {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.style.opacity = '0.7';
            
            // Store original text
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }
            button.textContent = 'Processing...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.style.opacity = '1';
            
            // Restore original text
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    setFormLoading(loading) {
        const button = this.elements.submitForm;
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.innerHTML = 'Processing... <span class="btn-icon">⏳</span>';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.innerHTML = 'Get Started Now <span class="btn-icon">→</span>';
            button.style.opacity = '1';
        }
    }

    /**
     * Enhanced notification system
     */
    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Set colors based on type
        let bgColor, textColor;
        switch (type) {
            case 'success':
                bgColor = '#10b981';
                textColor = 'white';
                break;
            case 'error':
                bgColor = '#ef4444';
                textColor = 'white';
                break;
            case 'info':
            default:
                bgColor = '#d4af37'; // Gold for info
                textColor = 'white';
                break;
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            color: ${textColor};
            background: ${bgColor};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-weight: 500;
            font-size: 0.9rem;
            line-height: 1.4;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-hide after delay
        const hideDelay = type === 'error' ? 6000 : 4000;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, hideDelay);

        // Allow manual dismissal
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    showFormSuccess(message = 'Thank you! We\'ll contact you soon.') {
        this.showNotification(message, 'success');
        if (this.elements.contactForm) {
            this.elements.contactForm.style.opacity = '0.8';
            setTimeout(() => {
                this.elements.contactForm.style.opacity = '1';
            }, 3000);
        }
    }

    showFormError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Performance monitoring
     */
    startPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        this.trackEvent('Performance', 'Page Load', {
                            loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                            firstPaint: this.getFirstPaint()
                        });
                    }
                }, 1000);
            });
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    /**
     * Event tracking
     */
    trackEvent(category, action, properties = {}) {
        try {
            const eventData = {
                category,
                action,
                properties: {
                    ...properties,
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href,
                    user_agent: navigator.userAgent,
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                    environment: this.state.environment
                }
            };

            // Log in development
            if (this.state.environment === 'development') {
                console.log('📊 Analytics Event:', eventData);
            }

            // Send to analytics in production
            if (this.state.environment === 'production') {
                this.sendAnalyticsEvent(eventData);
            }
        } catch (error) {
            console.warn('[Lumomire] Analytics tracking failed:', error);
        }
    }

    async sendAnalyticsEvent(eventData) {
        try {
            // Send to your analytics service when available
            await fetch(this.getApiUrl() + '/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData),
                keepalive: true
            });
        } catch (error) {
            // Fail silently for analytics
            console.warn('[Lumomire] Failed to send analytics:', error);
        }
    }

    /**
     * Utility methods
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Error handling
     */
    handleError(message, error) {
        console.error(`[Lumomire] ${message}:`, error);
        
        if (this.state.environment === 'production') {
            this.trackEvent('Error', message, {
                error_message: error.message,
                error_stack: error.stack
            });
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        console.log('[Lumomire] Application destroyed');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.LumomireApp = new LumomireApp();
    } catch (error) {
        console.error('[Lumomire] Failed to initialize:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.LumomireApp) {
        window.LumomireApp.destroy();
    }
});

// Export for external use
window.Lumomire = {
    App: LumomireApp,
    version: '1.0.0'
};