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
        // Function to apply Prism highlighting
        const applyPrismHighlighting = () => {
            if (typeof Prism !== 'undefined' && Prism.highlightAll) {
                try {
                    Prism.highlightAll();
                    console.log('Prism.js syntax highlighting applied successfully');
                    
                    // Additional optimization: ensure proper font rendering
                    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
                    codeBlocks.forEach(block => {
                        // Force repaint for better rendering
                        block.style.transform = 'translateZ(0)';
                    });
                } catch (error) {
                    console.warn('Prism highlighting failed:', error);
                    this.applyFallbackCodeStyling();
                }
            } else {
                console.warn('Prism.js not available, applying fallback styling');
                this.applyFallbackCodeStyling();
            }
        };

        // Try immediate highlighting
        applyPrismHighlighting();
        
        // Also try after a short delay for late-loaded scripts
        setTimeout(applyPrismHighlighting, 200);
    }

    // Apply fallback styling when Prism.js is not available
    applyFallbackCodeStyling() {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.style.display = 'block';
            block.style.padding = '1rem';
            block.style.backgroundColor = '#f8f8f8';
            block.style.border = '1px solid #e5e7eb';
            block.style.borderRadius = '8px';
            block.style.fontFamily = '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace';
            block.style.fontSize = '14px';
            block.style.lineHeight = '1.6';
            block.style.overflow = 'auto';
            block.style.webkitFontSmoothing = 'antialiased';
            block.style.mozOsxFontSmoothing = 'grayscale';
            block.style.textRendering = 'optimizeLegibility';
        });
        console.log('Applied fallback code styling');
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
