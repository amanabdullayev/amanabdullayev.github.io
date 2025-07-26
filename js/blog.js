// Blog page specific functionality
class BlogPage {
    constructor() {
        this.allPosts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = CONFIG.settings.postsPerPage || 6;
        this.currentTag = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    async init() {
        // Load all blog posts
        await this.loadAllPosts();
        
        // Initialize search and filter functionality
        this.initSearchAndFilter();
        
        // Initialize pagination
        this.initPagination();
    }

    // Load all blog posts
    async loadAllPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsContainer = document.getElementById('posts-container');
        const noPostsElement = document.getElementById('no-posts');
        
        try {
            if (!notionAPI) {
                this.showFallbackPosts();
                return;
            }

            this.allPosts = await notionAPI.getBlogPosts();
            
            if (this.allPosts.length === 0) {
                loadingElement.style.display = 'none';
                noPostsElement.style.display = 'block';
                noPostsElement.innerHTML = `
                    <h3>No blog posts found</h3>
                    <p>Make sure your Notion database is set up correctly and has published posts.</p>
                `;
                return;
            }

            // Hide loading, show posts container
            loadingElement.style.display = 'none';
            postsContainer.style.display = 'block';
            
            // Initialize filtered posts
            this.filteredPosts = [...this.allPosts];
            
            // Generate tag filters
            this.generateTagFilters();
            
            // Render initial posts
            this.renderPosts();
            
            // Setup pagination
            this.setupPagination();

        } catch (error) {
            console.error('Error loading blog posts:', error);
            loadingElement.innerHTML = '<p class="error">Failed to load blog posts. Please check your Notion configuration.</p>';
        }
    }

    // Generate tag filter buttons
    generateTagFilters() {
        const tagFilters = document.getElementById('tag-filters');
        if (!tagFilters) return;
        
        // Get all unique tags
        const allTags = [...new Set(this.allPosts.flatMap(post => post.tags))];
        
        tagFilters.innerHTML = allTags.map(tag => `
            <button class="tag-filter" data-tag="${tag}">${tag}</button>
        `).join('');
        
        // Add click listeners
        tagFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter')) {
                this.filterByTag(e.target.dataset.tag);
            }
        });
    }

    // Initialize search and filter functionality
    initSearchAndFilter() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        // Search functionality
        const performSearch = () => {
            this.searchQuery = searchInput.value.toLowerCase().trim();
            this.currentPage = 1;
            this.applyFilters();
        };
        
        searchInput.addEventListener('input', Utils.debounce(performSearch, 300));
        searchBtn.addEventListener('click', performSearch);
        
        // Enter key search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Tag filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter')) {
                this.filterByTag(e.target.dataset.tag);
            }
        });
    }

    // Filter posts by tag
    filterByTag(tag) {
        // Update active tag button
        document.querySelectorAll('.tag-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tag === 'all') {
            document.querySelector('.tag-filter[data-tag="all"]').classList.add('active');
        } else {
            document.querySelector(`.tag-filter[data-tag="${tag}"]`).classList.add('active');
        }
        
        this.currentTag = tag;
        this.currentPage = 1;
        this.applyFilters();
    }

    // Apply search and tag filters
    applyFilters() {
        let filtered = [...this.allPosts];
        
        // Apply tag filter
        if (this.currentTag !== 'all') {
            filtered = filtered.filter(post => post.tags.includes(this.currentTag));
        }
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(post => {
                return post.title.toLowerCase().includes(this.searchQuery) ||
                       post.excerpt.toLowerCase().includes(this.searchQuery) ||
                       post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            });
        }
        
        this.filteredPosts = filtered;
        this.renderPosts();
        this.setupPagination();
        
        // Show/hide no posts message
        const noPostsElement = document.getElementById('no-posts');
        const postsContainer = document.getElementById('posts-container');
        
        if (this.filteredPosts.length === 0) {
            postsContainer.style.display = 'none';
            noPostsElement.style.display = 'block';
        } else {
            postsContainer.style.display = 'block';
            noPostsElement.style.display = 'none';
        }
    }

    // Render posts for current page
    renderPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;
        
        // Calculate posts for current page
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);
        
        // Render posts
        postsGrid.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
        
        // Add animation classes with stagger
        document.querySelectorAll('.post-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
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

    // Setup pagination
    setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" data-page="prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                ← Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" data-page="next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next →
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    // Initialize pagination event listeners
    initPagination() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn') && !e.target.disabled) {
                const page = e.target.dataset.page;
                
                if (page === 'prev') {
                    this.currentPage = Math.max(1, this.currentPage - 1);
                } else if (page === 'next') {
                    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
                    this.currentPage = Math.min(totalPages, this.currentPage + 1);
                } else {
                    this.currentPage = parseInt(page);
                }
                
                this.renderPosts();
                this.setupPagination();
                
                // Scroll to top of posts
                document.getElementById('posts-grid').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    }

    // Show fallback posts when Notion API is not configured
    showFallbackPosts() {
        const loadingElement = document.getElementById('loading-posts');
        const postsContainer = document.getElementById('posts-container');
        
        loadingElement.style.display = 'none';
        postsContainer.style.display = 'block';
        
        const fallbackPosts = [
            {
                title: "Getting Started with Your Blog",
                excerpt: "Configure your Notion database and API token to start displaying your blog posts automatically. This comprehensive guide will walk you through the entire setup process.",
                date: "Dec 15, 2024",
                tags: ["Setup", "Tutorial", "Notion"],
                url: "#"
            },
            {
                title: "Customizing Your Portfolio Design",
                excerpt: "Learn how to customize the design, colors, and content of your portfolio to match your personal brand and style preferences. Make it truly yours.",
                date: "Dec 10, 2024",
                tags: ["Customization", "Design", "CSS"],
                url: "#"
            },
            {
                title: "Building with Notion API",
                excerpt: "Discover how to integrate Notion as a content management system for your website. Perfect for bloggers and content creators.",
                date: "Dec 5, 2024",
                tags: ["API", "Integration", "Notion"],
                url: "#"
            },
            {
                title: "Modern Web Development Trends",
                excerpt: "Exploring the latest trends and technologies in web development for 2024. Stay ahead of the curve with these insights.",
                date: "Dec 1, 2024",
                tags: ["Web Dev", "Trends", "Technology"],
                url: "#"
            },
            {
                title: "Responsive Design Best Practices",
                excerpt: "Master the art of creating websites that look great on all devices. Learn the principles of mobile-first design.",
                date: "Nov 28, 2024",
                tags: ["Design", "Mobile", "Responsive"],
                url: "#"
            },
            {
                title: "JavaScript Performance Optimization",
                excerpt: "Tips and techniques for writing faster, more efficient JavaScript code. Improve your website's performance.",
                date: "Nov 25, 2024",
                tags: ["JavaScript", "Performance", "Optimization"],
                url: "#"
            }
        ];
        
        this.allPosts = fallbackPosts;
        this.filteredPosts = fallbackPosts;
        
        // Generate tag filters for fallback posts
        this.generateTagFilters();
        
        // Render posts
        this.renderPosts();
        this.setupPagination();
        
        // Add info message
        const infoMessage = document.createElement('div');
        infoMessage.className = 'error';
        infoMessage.innerHTML = 'Configure your Notion API in <code>js/config.js</code> to display your actual blog posts.';
        document.getElementById('posts-grid').parentNode.insertBefore(infoMessage, document.getElementById('posts-grid'));
    }
}

// Initialize blog page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPage();
});
