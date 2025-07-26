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
        if (!
