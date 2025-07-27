// Blog Post Page - Individual blog post display
class BlogPostPage {
    constructor() {
        this.init();
    }

    async init() {
        // Get post slug from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');
        
        if (!postSlug) {
            this.showPostNotFound();
            return;
        }

        await this.loadBlogPost(postSlug);
        this.initializeSharing();
    }

    async loadBlogPost(slug) {
        const loadingElement = document.getElementById('loading-post');
        const postNotFoundElement = document.getElementById('post-not-found');
        const postContentElement = document.getElementById('blog-post-content');

        try {
            if (!markdownBlogCMS) {
                throw new Error('Blog system not initialized');
            }

            // Load the blog post
            const post = await markdownBlogCMS.getBlogPost(slug);
            
            if (!post) {
                throw new Error('Post not found');
            }

            // Hide loading, show content
            loadingElement.style.display = 'none';
            postContentElement.style.display = 'block';

            // Update page metadata
            this.updatePageMetadata(post);

            // Populate post content
            this.populatePostContent(post);

        } catch (error) {
            console.error('Error loading blog post:', error);
            this.showPostNotFound();
        }
    }

    updatePageMetadata(post) {
        // Update page title
        document.title = `${post.title} - Aman Abdullayev`;
        document.getElementById('post-title').textContent = document.title;
        
        // Update meta description
        if (post.excerpt) {
            const metaDescription = document.getElementById('post-description');
            metaDescription.setAttribute('content', post.excerpt);
        }
    }

    populatePostContent(post) {
        // Post title
        document.getElementById('blog-post-title').textContent = post.title;

        // Author info - simple name only
        if (post.author) {
            document.getElementById('author-name').textContent = post.author.name;
        }

        // Post date
        const formattedDate = markdownBlogCMS.formatDate(post.date);
        document.getElementById('post-date').textContent = formattedDate;
        document.getElementById('post-date').setAttribute('datetime', post.date);

        // Tags
        this.populateTags(post.tags);

        // Post content
        document.getElementById('blog-post-body').innerHTML = post.content;

        // Highlight code blocks if Prism.js is available
        if (typeof Prism !== 'undefined') {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }

        // Update sharing links
        this.updateSharingLinks(post);
    }

    populateTags(tags) {
        const tagsContainer = document.getElementById('post-tags');
        
        if (tags && tags.length > 0) {
            const tagsHtml = tags.map(tag => {
                const colorIndex = getTagColorIndex(tag);
                return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
            }).join('');
            tagsContainer.innerHTML = tagsHtml;
        } else {
            tagsContainer.style.display = 'none';
        }
    }

    updateSharingLinks(post) {
        const postUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(post.title);
        
        // Twitter share
        const twitterUrl = `https://twitter.com/intent/tweet?text=${postTitle}&url=${postUrl}`;
        document.getElementById('share-twitter').href = twitterUrl;

        // LinkedIn share
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        document.getElementById('share-linkedin').href = linkedinUrl;
    }

    initializeSharing() {
        // Copy link functionality
        document.getElementById('share-copy').addEventListener('click', (e) => {
            e.preventDefault();
            
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Show feedback
                const copyBtn = e.target;
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback: select the URL
                const tempInput = document.createElement('input');
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                const copyBtn = e.target;
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        });
    }

    showPostNotFound() {
        document.getElementById('loading-post').style.display = 'none';
        document.getElementById('post-not-found').style.display = 'block';
        
        // Update page title
        document.title = 'Post Not Found - Aman Abdullayev';
    }
}

// Initialize blog post page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPostPage();
});
