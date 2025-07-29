// Blog Post Page - Static page functionality
class BlogPostPage {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize sharing functionality (static pages have content pre-rendered)
        this.initializeSharing();
        
        // Initialize code highlighting
        this.initializeCodeHighlighting();
    }

    // Initialize code highlighting with robust error handling
    initializeCodeHighlighting() {
        // Enhanced code highlighting initialization
        if (typeof Prism !== 'undefined') {
            try {
                // Re-highlight all code blocks
                Prism.highlightAll();
            } catch (error) {
                // Fallback if Prism fails
                this.applyFallbackCodeStyling();
            }
        } else {
            // Prism.js not loaded, apply fallback styling
            this.applyFallbackCodeStyling();
        }
    }

    // Apply fallback styling when Prism.js is not available
    applyFallbackCodeStyling() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.style.display = 'block';
            block.style.padding = '1rem';
            block.style.backgroundColor = '#f5f5f5';
            block.style.borderRadius = '6px';
            block.style.fontFamily = 'Consolas, Monaco, "Andale Mono", monospace';
            block.style.fontSize = '0.9rem';
            block.style.lineHeight = '1.5';
            block.style.overflow = 'auto';
        });
    }

    initializeSharing() {
        // Copy link functionality
        const copyBtn = document.getElementById('share-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                navigator.clipboard.writeText(window.location.href).then(() => {
                    // Show feedback
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
                    
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✅ Copied!';
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                });
            });
        }
    }
}

// Initialize blog post page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on static blog post pages (pages that have the blog post structure)
    if (document.querySelector('.blog-post')) {
        new BlogPostPage();
    }
});
