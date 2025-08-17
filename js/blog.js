// Blog page specific functionality
class BlogPage {
    constructor() {
        this.allPosts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = CONFIG?.settings?.postsPerPage || 6;
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
        
        if (!loadingElement || !postsContainer || !noPostsElement) {
            return;
        }
        
        try {
            // Use blog index system
            if (!blogIndex) {
                loadingElement.style.display = 'none';
                noPostsElement.style.display = 'block';
                noPostsElement.innerHTML = `
                    <h3>Blog system not available</h3>
                    <p>Unable to load the blog index system. Please check your setup.</p>
                `;
                return;
            }

            this.allPosts = await blogIndex.getBlogPosts();
            
            if (this.allPosts.length === 0) {
                loadingElement.style.display = 'none';
                noPostsElement.style.display = 'block';
                noPostsElement.innerHTML = `
                    <h3>No blog posts found</h3>
                    <p>Add markdown files to the <code>blog-posts/</code> folder to get started.</p>
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
            loadingElement.style.display = 'none';
            noPostsElement.style.display = 'block';
            noPostsElement.innerHTML = `
                <h3>Error loading blog posts</h3>
                <p>Unable to load posts. Please check your setup.</p>
            `;
        }
    }

    // Generate tag filter buttons
    generateTagFilters() {
        const tagFilters = document.getElementById('tag-filters');
        if (!tagFilters) return;
        
        // Get all unique tags
        const allTags = [...new Set(this.allPosts.flatMap(post => post.tags))];
        
        tagFilters.innerHTML = allTags.map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<button class="tag-filter tag" data-tag="${tag}" data-color="${colorIndex}">${tag}</button>`;
        }).join('');
        
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
        const formattedDate = blogIndex ? blogIndex.formatDate(post.date) : post.date;
        const tagsHtml = post.tags ? post.tags.map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
        }).join('') : '';
        
        // Use simple HTML link instead of JavaScript onclick
        const postUrl = `${post.slug}/`;
        
        // Handle cover image
        const coverImageHtml = post.coverImage ? 
            `<div class="post-cover">
                <img src="../blog-posts/${post.coverImage}" 
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
}

// Global function for blog post navigation
async function navigateToBlogPost(slug) {
    // Set a flag to help with path resolution during client-side navigation
    window._blogBasePath = '../';
    
    // Update the URL without causing a page reload
    const newUrl = `/blog/${slug}`;
    window.history.pushState({ slug: slug }, '', newUrl);
    
    // Hide blog listing and show blog post
    const blogListContainer = document.querySelector('.blog-posts');
    const blogPostContainer = document.getElementById('blog-post-container');
    
    if (blogListContainer) blogListContainer.style.display = 'none';
    if (blogPostContainer) blogPostContainer.style.display = 'block';
    
    // Load the blog post content
    if (typeof initializeBlogPost === 'function') {
        try {
            await initializeBlogPost(slug);
        } catch (error) {
            // Error handling without console output
        }
    }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.slug) {
        // User navigated to a blog post
        navigateToBlogPost(event.state.slug);
    } else {
        // User navigated back to blog listing
        const blogListContainer = document.querySelector('.blog-posts');
        const blogPostContainer = document.getElementById('blog-post-container');
        
        if (blogListContainer) blogListContainer.style.display = 'block';
        if (blogPostContainer) blogPostContainer.style.display = 'none';
    }
});

// Initialize blog page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the blog listing page
    const path = window.location.pathname;
    const isBlogListing = path.endsWith('/blog/') || 
                         path.endsWith('/blog/index.html') ||
                         path === '/blog';
    
    if (isBlogListing) {
        new BlogPage();
    }
});
