// Home page specific functionality
class HomePage {
    constructor() {
        this.init();
    }

    async init() {
        // Load about content (moved from about page)
        await this.loadAboutContent();
        
        // Load stats/what I'm working on
        this.loadHomeStats();
        
        // Load latest blog posts (only 4)
        await this.loadLatestPosts();
    }

    // Load home intro content from Notion or config
    async loadAboutContent() {
        const introText = document.getElementById('intro-text');
        if (!introText) return;
        
        try {
            // Try to load from Notion if page ID is provided
            if (notionAPI && CONFIG.notion && CONFIG.notion.aboutPageId) {
                const content = await notionAPI.getPageContent(CONFIG.notion.aboutPageId);
                if (content) {
                    introText.innerHTML = content;
                    return;
                }
            }
            
            // Fallback to config - use homeIntro for home page
            if (typeof CONFIG !== 'undefined' && CONFIG.personal.homeIntro) {
                introText.innerHTML = CONFIG.personal.homeIntro;
            }
        } catch (error) {
            console.error('Error loading home intro content:', error);
            // Keep the fallback content
        }
    }

    // Load home stats/what I'm working on section
    loadHomeStats() {
        if (typeof CONFIG === 'undefined' || !CONFIG.homeStats) return;
        
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid) return;
        
        statsGrid.innerHTML = CONFIG.homeStats.map(stat => `
            <div class="stat-card fade-in">
                <div class="stat-icon">${stat.icon}</div>
                <h3 class="stat-title">${stat.title}</h3>
                <p class="stat-description">${stat.description}</p>
            </div>
        `).join('');
        
        // Add staggered animation
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 200);
        });
    }

    // Load latest blog posts (only show the first 4)
    async loadLatestPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsGrid = document.getElementById('posts-grid');
        
        try {
            if (!notionAPI) {
                this.showFallbackPosts();
                return;
            }

            const allPosts = await notionAPI.getBlogPosts();
            // Only show the latest 4 posts on home page
            const latestPosts = allPosts.slice(0, CONFIG.settings.homePostsCount || 4);
            
            if (latestPosts.length === 0) {
                loadingElement.innerHTML = '<p class="error">No blog posts found. Make sure your Notion database is set up correctly.</p>';
                return;
            }

            // Hide loading, show posts
            loadingElement.style.display = 'none';
            postsGrid.style.display = 'grid';
            
            // Render posts
            postsGrid.innerHTML = latestPosts.map(post => this.createPostCard(post)).join('');
            
            // Add animation classes with stagger
            document.querySelectorAll('.post-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });

        } catch (error) {
            console.error('Error loading latest posts:', error);
            loadingElement.innerHTML = '<p class="error">Failed to load blog posts. Please check your Notion configuration.</p>';
        }
    }

    // Create HTML for a blog post card
    createPostCard(post) {
        const formattedDate = notionAPI ? notionAPI.formatDate(post.date) : post.date;
        const tagsHtml = post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join(''); // Limit tags on home page
        
        return `
            <article class="post-card">
                <h3 class="post-title">
                    <a href="${post.url}" target="_blank">${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt.length > 150 ? post.excerpt.substring(0, 150) + '...' : post.excerpt}</p>
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
                excerpt: "Configure your Notion database and API token to start displaying your blog posts automatically.",
                date: "Dec 15, 2024",
                tags: ["Setup", "Tutorial"],
                url: "#"
            },
            {
                title: "Customizing Your Portfolio",
                excerpt: "Learn how to customize the design, colors, and content of your portfolio to match your personal brand.",
                date: "Dec 10, 2024",
                tags: ["Customization", "Design"],
                url: "#"
            },
            {
                title: "Building with Notion API",
                excerpt: "Discover how to integrate Notion as a content management system for your website.",
                date: "Dec 5, 2024",
                tags: ["API", "Integration"],
                url: "#"
            },
            {
                title: "Modern Web Development",
                excerpt: "Exploring the latest trends and technologies in web development for 2024.",
                date: "Dec 1, 2024",
                tags: ["Web Dev", "Trends"],
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
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
