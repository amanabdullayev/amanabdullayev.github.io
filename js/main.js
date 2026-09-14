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

// Shared utility function to create blog post cards - eliminates code duplication
function createPostCard(post, context = 'home') {
    const formattedDate = blogIndex ? blogIndex.formatDate(post.date) : post.date;
    const tagsHtml = post.tags ? post.tags.map(tag => {
        const colorIndex = getTagColorIndex(tag);
        return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
    }).join('') : '';
    
    // Determine URL and image paths based on context
    const postUrl = context === 'home' ? `blog/${post.slug}/` : `${post.slug}/`;
    const imagePath = context === 'home' ? 'blog-posts/' : '../blog-posts/';
    
    // Handle cover image
    const coverImageHtml = post.coverImage ? 
        `<div class="post-cover">
            <img src="${imagePath}${post.coverImage}" 
                 alt="${post.title}" 
                 class="post-cover-image"
                 loading="lazy">
        </div>` : '';
    
    return `
        <article class="post-card">
            <a href="${postUrl}" style="text-decoration: none; color: inherit; display: block;">
                ${coverImageHtml}
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-tags">${tagsHtml}</div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date">${formattedDate}</span>
                    </div>
                </div>
            </a>
        </article>
    `;
}

// Load GoatCounter analytics script
(function() {
    const script = document.createElement('script');
    script.setAttribute('data-goatcounter', 'https://amanabdullayev.goatcounter.com/count');
    script.async = true;
    script.src = '//gc.zgo.at/count.js';
    script.onload = function() {
        console.log('goatcounter loaded successfully');
    };
    document.head.appendChild(script);
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

        // Update footer
        const footerName = document.getElementById('footer-name');
        if (footerName) {
            footerName.textContent = personal.name;
        }

        const footerYear = document.getElementById('footer-year');
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
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
        const segments = window.location.pathname.split('/').filter(Boolean);
        const page = segments[0];

        if (page === 'blog' && segments.length > 1 && segments[1] !== 'index.html') {
            return null;
        }

        if (['about', 'blog', 'contact', 'projects'].includes(page)) {
            return page;
        }

        return null; // Home page or unknown
    }

    // Initialize navigation and the small-screen menu
    initNavigation() {
        const menuToggle = document.getElementById('nav-menu-toggle');
        const menu = document.getElementById('primary-nav');

        if (!menuToggle || !menu) return;

        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open menu');
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', () => {
            const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
            menuToggle.setAttribute('aria-expanded', String(willOpen));
            menuToggle.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
            menu.classList.toggle('is-open', willOpen);
            document.body.classList.toggle('menu-open', willOpen);
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 700) closeMenu();
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
        const savedTheme = localStorage.getItem('theme');
        const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = savedTheme || preferredTheme;
        
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcons(theme);
        this.updateManifestThemeColor(theme);
        this.setupSimpleThemeListeners();
    }
    
    setupSimpleThemeListeners() {
        const buttons = document.querySelectorAll('#theme-toggle, #footer-theme-toggle');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
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
        const isDark = theme === 'dark';
        const icon = isDark
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5a8.5 8.5 0 1 0 10.6 10.6Z"></path></svg>';
        
        themeIcons.forEach(iconElement => {
            iconElement.innerHTML = icon;
        });

        document.querySelectorAll('#theme-toggle, #footer-theme-toggle').forEach(button => {
            button.setAttribute('aria-label', isDark ? 'Use light theme' : 'Use dark theme');
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
            const color = theme === 'light' ? '#9b4f35' : '#1e1c19';
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
    // Skip empty script errors and Prism.js errors
    if (!e.message || e.message === 'Script error.' || 
        (e.filename && e.filename.includes('prism'))) {
        return;
    }
    
    // Only log meaningful errors
    console.error('Portfolio error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
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
