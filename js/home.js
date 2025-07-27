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
            // Use markdown blog system
            if (!markdownBlogCMS) {
                this.showFallbackPosts();
                return;
            }

            const allPosts = await markdownBlogCMS.getBlogPosts();
            // Only show the latest 4 posts on home page
            const latestPosts = allPosts.slice(0, CONFIG.settings.homePostsCount || 4);
            
            if (latestPosts.length === 0) {
                loadingElement.innerHTML = '<p class="error">No blog posts found. Add markdown files to the <code>blog-posts/</code> folder.</p>';
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
            loadingElement.innerHTML = '<p class="error">Failed to load blog posts. Please check your markdown blog configuration.</p>';
        }
    }

    // Create HTML for a blog post card
    createPostCard(post) {
        const formattedDate = markdownBlogCMS ? markdownBlogCMS.formatDate(post.date) : post.date;
        const tagsHtml = post.tags.slice(0, 3).map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
        }).join(''); // Limit tags on home page
        
        return `
            <article class="post-card" onclick="window.location.href='blog-post.html?post=${post.slug}'" style="cursor: pointer;">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-tags">${tagsHtml}</div>
                <p class="post-excerpt">${post.excerpt.length > 150 ? post.excerpt.substring(0, 150) + '...' : post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                </div>
            </article>
        `;
    }

    // Show fallback posts when markdown blog system is not available
    showFallbackPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsGrid = document.getElementById('posts-grid');
        
        loadingElement.style.display = 'none';
        postsGrid.style.display = 'grid';
        
        const fallbackPosts = [
            {
                title: "Getting Started with Your Blog",
                excerpt: "Add markdown files to the blog-posts/ folder to start displaying your blog posts automatically.",
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
                title: "Markdown Blog System",
                excerpt: "Discover how to use the markdown-based blog system for your website content management.",
                date: "Dec 5, 2024",
                tags: ["Markdown", "Blog"],
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
        infoMessage.innerHTML = 'Add markdown files to <code>blog-posts/</code> folder to display your actual blog posts. Check the <a href="PRIVATE_REPO_BLOG_GUIDE.md" target="_blank">setup guide</a> for more information.';
        postsGrid.parentNode.insertBefore(infoMessage, postsGrid);
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
