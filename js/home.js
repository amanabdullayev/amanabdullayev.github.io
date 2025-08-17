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

    // Load home intro content from config
    async loadAboutContent() {
        const introText = document.getElementById('intro-text');
        if (!introText) return;
        
        try {
            // Use homeIntro from config for home page
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
            // Use blog index system
            if (!blogIndex) {
                loadingElement.innerHTML = '<p class="error">Blog system not available. Please check your setup.</p>';
                return;
            }

            const allPosts = await blogIndex.getBlogPosts();
            // Only show the latest 4 posts on home page
            const latestPosts = allPosts.slice(0, CONFIG.settings.homePostsCount || 4);
            
            if (latestPosts.length === 0) {
                loadingElement.innerHTML = '<p class="error">No blog posts found. Add markdown files to the <code>blog-posts/</code> folder.</p>';
                return;
            }

            // Hide loading, show posts
            loadingElement.style.display = 'none';
            postsGrid.style.display = 'grid';
            
            // Render posts using shared utility function
            postsGrid.innerHTML = latestPosts.map(post => createPostCard(post, 'home')).join('');
            
            // Add animation classes with stagger
            document.querySelectorAll('.post-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });

        } catch (error) {
            console.error('Error loading latest posts:', error);
            loadingElement.innerHTML = '<p class="error">Failed to load blog posts. Please check your blog system configuration.</p>';
        }
    }
}

// Global function for blog post navigation from home page
if (typeof navigateToPost === 'undefined') {
    function navigateToPost(slug) {
        console.log('Navigating to blog post from home:', slug);
        // Navigate to the blog post URL with trailing slash for static page
        window.location.href = `/blog/${slug}/`;
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run on home page
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
        new HomePage();
    }
});
