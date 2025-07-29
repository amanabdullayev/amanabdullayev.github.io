// Utility function to generate consistent colors for tags
function getTagColorIndex(tagName) {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        const char = tagName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 10; // Return index between 0-9
}

// Initialize Counter.dev analytics
function initAnalytics() {
    // Check if analytics is enabled in config
    if (typeof CONFIG !== 'undefined' && !CONFIG.settings.enableAnalytics) {
        console.log('Analytics disabled in config');
        return;
    }
    
    // Check if script already exists to prevent duplicates
    if (document.querySelector('script[data-id="0d04bd09-31ab-4270-8229-a8691744db89"]')) {
        console.log('Analytics already loaded');
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.counter.dev/script.js';
    script.setAttribute('data-id', '0d04bd09-31ab-4270-8229-a8691744db89');
    script.setAttribute('data-utcoffset', '2');
    script.async = true;
    
    // Add load event listener for debugging
    script.onload = function() {
        console.log('Counter.dev analytics loaded successfully');
    };
    
    script.onerror = function() {
        console.error('Failed to load Counter.dev analytics');
    };
    
    document.head.appendChild(script);
    console.log('Counter.dev script added to head');
}

// Initialize Counter.dev analytics - single, clean initialization
(function() {
    // Wait for CONFIG to load before initializing analytics
    function waitForConfigAndInitAnalytics() {
        if (typeof CONFIG !== 'undefined') {
            initAnalytics();
        } else {
            // Wait a bit longer for CONFIG to load
            setTimeout(waitForConfigAndInitAnalytics, 100);
        }
    }
    
    // Simple, single initialization strategy
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForConfigAndInitAnalytics);
    } else {
        // DOM is already ready
        waitForConfigAndInitAnalytics();
    }
})();

// Main JavaScript file for portfolio functionality
class Portfolio {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize theme FIRST with a simple approach
        this.initSimpleTheme();
        
        // Load personal information
        this.loadPersonalInfo();
        
        // Load page-specific content
        this.loadPageContent();
        
        // Initialize navigation
        this.initNavigation();
        
        // Initialize animations
        this.initAnimations();
    }

    // Load personal information from config
    loadPersonalInfo() {
        if (typeof CONFIG === 'undefined') return;
        
        const { personal } = CONFIG;
        
        // Update hero section
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            heroTitle.textContent = `Welcome to My Digital Space`;
        }
        
        // Update footer
        const footerName = document.getElementById('footer-name');
        if (footerName) {
            footerName.textContent = personal.name;
        }
        
        // Update page title
        document.title = `${personal.name} - Portfolio & Blog`;
        
        // Update logo text only (preserve the image)
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            const logoImage = logoElement.querySelector('.logo-image');
            logoElement.innerHTML = '';
            if (logoImage) logoElement.appendChild(logoImage);
            logoElement.appendChild(document.createTextNode("Aman's Space"));
        }
    }

    // Load page-specific content (titles, descriptions)
    loadPageContent() {
        if (typeof CONFIG === 'undefined') return;
        
        // Determine current page
        const currentPage = this.getCurrentPage();
        
        // Update page-specific hero content
        if (currentPage && CONFIG.pages[currentPage]) {
            const pageData = CONFIG.pages[currentPage];
            
            // Update page hero title
            const heroTitle = document.getElementById('page-title');
            if (heroTitle) heroTitle.textContent = pageData.title;
            
            // Update page hero description
            const heroDescription = document.getElementById('page-description');
            if (heroDescription) heroDescription.textContent = pageData.description;
            
            // Update page title
            document.title = `${pageData.title} - ${CONFIG.personal.name}`;
        }
    }

    // Get current page from URL
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === 'about') return 'about';
        if (filename === 'blog') return 'blog';
        if (filename === 'contact') return 'contact';
        
        return null; // Home page or unknown
    }

    // Initialize smooth scrolling navigation
    initNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Initialize scroll animations (for general use, page-specific animations are handled separately)
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0.1s';
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        // Page-specific animations are handled by their respective page scripts
        document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize theme with a simple, direct approach
    initSimpleTheme() {
        // Set initial theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcons(savedTheme);
        
        // Set up event listeners using a direct approach
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            this.setupSimpleThemeListeners();
        }, 100);
    }
    
    setupSimpleThemeListeners() {
        const buttons = document.querySelectorAll('#theme-toggle, #footer-theme-toggle');
        
        buttons.forEach((button, index) => {
            // Remove existing listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add the click listener
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.simpleToggleTheme();
            });
        });
    }
    
    simpleToggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update DOM and localStorage
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icons
        this.updateThemeIcons(newTheme);
        
        // Update manifest theme color
        this.updateManifestThemeColor(newTheme);
    }
    
    updateThemeIcons(theme) {
        const themeIcons = document.querySelectorAll('.theme-icon');
        const icon = theme === 'light' ? '☀️' : '🌙';
        
        themeIcons.forEach(iconElement => {
            iconElement.textContent = icon;
        });
    }

    // Toggle between light and dark themes (kept for backward compatibility)
    toggleTheme() {
        this.simpleToggleTheme();
    }

    // Set theme and update UI (kept for backward compatibility)
    setTheme(theme) {
        // Set theme attribute on document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update theme toggle buttons
        this.updateThemeIcons(theme);
        
        // Update manifest theme color
        this.updateManifestThemeColor(theme);
    }

    // Update theme toggle button icons (kept for backward compatibility)
    updateThemeToggleButtons(theme) {
        this.updateThemeIcons(theme);
    }

    // Update manifest theme color for mobile browsers
    updateManifestThemeColor(theme) {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            const color = theme === 'light' ? '#2563eb' : '#3b82f6';
            themeColorMeta.setAttribute('content', color);
        }
    }
}

// Global function for blog post navigation from home page
function navigateToPost(slug) {
    console.log('Navigating to blog post from home:', slug);
    // Navigate to the blog post URL with trailing slash for static page
    window.location.href = `/blog/${slug}/`;
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    // Provide more detailed error information
    const errorInfo = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    };
    console.error('Portfolio error:', errorInfo);
    
    // Don't flood console with Prism.js errors
    if (e.filename && e.filename.includes('prism')) {
        console.warn('Prism.js error detected - this is usually non-critical for syntax highlighting');
    }
});

// Add some utility functions
const Utils = {
    // Format date consistently
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    },

    // Debounce function for performance
    debounce(func, wait) {
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
};
