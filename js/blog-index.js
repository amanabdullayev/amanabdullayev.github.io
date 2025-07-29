// Blog Index System - Simplified for static blog architecture
class BlogIndexSystem {
    constructor() {
        this.cache = new Map();
        this.cacheTime = 5 * 60 * 1000; // 5 minutes
    }

    // Get all blog posts from generated index
    async getBlogPosts() {
        const cacheKey = 'blog-posts';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTime) {
            return cached.data;
        }

        try {
            // Determine correct path based on current location
            let indexPath = 'js/blog-posts-index.json';
            
            // Check for base path override (for client-side navigation)
            if (window._blogBasePath) {
                indexPath = `${window._blogBasePath}js/blog-posts-index.json`;
            } else {
                const currentPath = window.location.pathname;
                
                // Check if we're in the blog section (including client-side routed blog posts)
                if (currentPath.startsWith('/blog')) {
                    // For any blog-related path, we're serving from /blog/index.html
                    indexPath = '../js/blog-posts-index.json';
                } else if (currentPath.endsWith('/about') || currentPath.endsWith('/contact') ||
                           currentPath.endsWith('/about/') || currentPath.endsWith('/contact/')) {
                    indexPath = '../js/blog-posts-index.json';
                }
            }
            
            const response = await fetch(indexPath);
            if (!response.ok) {
                throw new Error(`Failed to load blog posts: ${response.status}`);
            }

            const posts = await response.json();
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: posts,
                timestamp: Date.now()
            });

            return posts;
        } catch (error) {
            return [];
        }
    }

    // Get all unique tags
    async getAllTags() {
        const posts = await this.getBlogPosts();
        const tagSet = new Set();
        
        posts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => tagSet.add(tag));
            }
        });
        
        return Array.from(tagSet).sort();
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize blog index system
let blogIndex = null;
if (typeof window !== 'undefined') {
    blogIndex = new BlogIndexSystem();
}
