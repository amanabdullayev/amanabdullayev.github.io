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
        
        // Load contact links
        this.loadContactLinks();
        
        // Load blog posts from Notion
        await this.loadBlogPosts();
        
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
        
        if (filename === 'about.html') return 'about';
        if (filename === 'blog.html') return 'blog';
        if (filename === 'contact.html') return 'contact';
        
        return null; // Home page or unknown
    }

    // Load contact links from config
    loadContactLinks() {
        if (typeof CONFIG === 'undefined') return;
        
        const contactLinksContainer = document.getElementById('contact-links');
        contactLinksContainer.innerHTML = '';
        
        CONFIG.contact.forEach(contact => {
            const link = document.createElement('a');
            link.href = contact.url;
            link.className = 'contact-link';
            link.target = contact.url.startsWith('mailto:') ? '_self' : '_blank';
            link.innerHTML = `
                <span>${contact.icon}</span>
                <span>${contact.name}</span>
            `;
            contactLinksContainer.appendChild(link);
        });
    }

    // Load blog posts from Notion API
    async loadBlogPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsGrid = document.getElementById('posts-grid');
        
        try {
            if (!notionAPI) {
                this.showFallbackPosts();
                return;
            }

            const posts = await notionAPI.getBlogPosts();
            
            if (posts.length === 0) {
                loadingElement.innerHTML = '<p class="error">No blog posts found. Make sure your Notion database is set up correctly.</p>';
                return;
            }

            // Hide loading, show posts
            loadingElement.style.display = 'none';
            postsGrid.style.display = 'grid';
            
            // Render posts
            postsGrid.innerHTML = posts.map(post => this.createPostCard(post)).join('');
            
            // Add animation classes
            document.querySelectorAll('.post-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });

        } catch (error) {
            console.error('Error loading blog posts:', error);
            loadingElement.innerHTML = '<p class="error">Failed to load blog posts. Please check your Notion configuration.</p>';
        }
    }

    // Create HTML for a blog post card
    createPostCard(post) {
        const formattedDate = notionAPI ? notionAPI.formatDate(post.date) : post.date;
        const tagsHtml = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        return `
            <article class="post-card">
                <h3 class="post-title">
                    <a href="${post.url}" target="_blank">${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                    <div class="post-tags">${tagsHtml}</div>
                </div>
            </article>
        `;
    }

    // Show fallback posts when Notion API is not configured
    showFallbackPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsGrid = document.getElementById('posts-grid');
        
        loadingElement.style.display = 'none';
        postsGrid.style.display = 'grid';
        
        const fallbackPosts = [
            {
                title: "Getting Started with Your Blog",
                excerpt: "Configure your Notion database and API token to start displaying your blog posts automatically. This post will guide you through the setup process.",
                date: "Dec 15, 2024",
                tags: ["Setup", "Tutorial"],
                url: "#"
            },
            {
                title: "Customizing Your Portfolio",
                excerpt: "Learn how to customize the design, colors, and content of your portfolio to match your personal brand and style preferences.",
                date: "Dec 10, 2024",
                tags: ["Customization", "Design"],
                url: "#"
            }
        ];
        
        postsGrid.innerHTML = fallbackPosts.map(post => this.createPostCard(post)).join('');
        
        // Add info message
        const infoMessage = document.createElement('div');
        infoMessage.className = 'error';
        infoMessage.innerHTML = 'Configure your Notion API in <code>js/config.js</code> to display your actual blog posts.';
        postsGrid.parentNode.insertBefore(infoMessage, postsGrid);
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

        // Observe elements that should animate on scroll (only contact-links for now)
        // Other page-specific animations are handled by their respective page scripts
        document.querySelectorAll('.contact-links').forEach(el => {
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

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
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
