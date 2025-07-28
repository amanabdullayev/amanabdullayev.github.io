// Markdown Blog System - Simple and Optimized
class MarkdownBlogCMS {
    constructor() {
        this.cache = new Map();
        this.cacheTime = 5 * 60 * 1000; // 5 minutes
        this.blogPostsPath = 'blog-posts/';
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
            console.error('Error loading blog posts:', error);
            return [];
        }
    }

    // Get a specific blog post content
    async getBlogPost(slug) {
        try {
            console.log('getBlogPost: Starting with slug:', slug);
            
            // First, try to load all posts to find the file that matches this slug
            const allPosts = await this.getBlogPosts();
            console.log('getBlogPost: Loaded', allPosts.length, 'total posts');
            console.log('getBlogPost: Available slugs:', allPosts.map(p => p.slug));
            
            const matchingPost = allPosts.find(post => post.slug === slug);
            console.log('getBlogPost: Matching post found:', !!matchingPost);
            
            if (!matchingPost) {
                console.error('getBlogPost: No post found with slug:', slug);
                throw new Error(`Blog post not found with slug: ${slug}`);
            }
            
            console.log('getBlogPost: Found post:', matchingPost.title, 'fileSlug:', matchingPost.fileSlug);
            
            // Determine correct path based on current location
            let blogPostsPath = 'blog-posts/';
            
            // Check for base path override (for client-side navigation)
            if (window._blogBasePath) {
                blogPostsPath = `${window._blogBasePath}blog-posts/`;
            } else {
                const currentPath = window.location.pathname;
                console.log('getBlogPost: Current path:', currentPath);
                
                // Check if we're in the blog section (including client-side routed blog posts)
                if (currentPath.startsWith('/blog')) {
                    // For any blog-related path, we're serving from /blog/index.html
                    blogPostsPath = '../blog-posts/';
                } else if (currentPath.endsWith('/about') || currentPath.endsWith('/contact') ||
                           currentPath.endsWith('/about/') || currentPath.endsWith('/contact/')) {
                    blogPostsPath = '../blog-posts/';
                }
            }
            
            console.log('getBlogPost: Using blog posts path:', blogPostsPath);
            
            // Load the actual markdown file using the file slug
            const fileSlug = matchingPost.fileSlug || matchingPost.slug;
            const markdownUrl = `${blogPostsPath}${fileSlug}.md`;
            console.log('getBlogPost: Loading markdown from:', markdownUrl);
            
            const response = await fetch(markdownUrl);
            console.log('getBlogPost: Fetch response:', response.ok, response.status);
            
            if (!response.ok) {
                console.error('getBlogPost: Failed to fetch markdown file:', markdownUrl);
                throw new Error(`Blog post file not found: ${fileSlug}`);
            }
            
            const markdown = await response.text();
            console.log('getBlogPost: Markdown loaded, length:', markdown.length);
            
            const parsedPost = this.parseMarkdownPost(markdown, fileSlug);
            console.log('getBlogPost: Post parsed successfully');
            
            return parsedPost;
        } catch (error) {
            console.error('getBlogPost: Failed to load blog post:', error);
            return null;
        }
    }

    // Parse markdown content and extract metadata
    parseMarkdownPost(markdown, slug) {
        const lines = markdown.split('\n');
        const metadata = {};
        let contentStart = 0;

        // Extract metadata from markdown front matter or first few lines
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('**Published:**')) {
                metadata.date = this.extractDateFromLine(line);
            } else if (line.startsWith('**Tags:**')) {
                metadata.tags = this.extractTagsFromLine(line);
            } else if (line.startsWith('**Excerpt:**')) {
                metadata.excerpt = this.extractExcerptFromLine(line);
            } else if (line.startsWith('**Slug:**')) {
                metadata.slug = this.extractSlugFromLine(line);
            } else if (line === '---' && i > 0) {
                contentStart = i + 1;
                break;
            }
        }

        // Extract title from first h1
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1];
        }

        // Get content after metadata
        const content = lines.slice(contentStart).join('\n');

        // Use the slug from metadata if available, otherwise fall back to filename slug
        const postSlug = metadata.slug || slug;

        return {
            slug: postSlug,
            fileSlug: slug, // Keep original filename slug for file loading
            ...metadata,
            content: this.processMarkdown(content),
            rawContent: content,
            url: `blog/${postSlug}`,
            id: postSlug,
            author: {
                name: 'Aman Abdullayev'
            }
        };
    }

    // Extract date from metadata line
    extractDateFromLine(line) {
        const dateMatch = line.match(/\*\*Published:\*\*\s+(.+)/);
        if (dateMatch) {
            return new Date(dateMatch[1]).toISOString();
        }
        return new Date().toISOString();
    }

    // Extract tags from metadata line
    extractTagsFromLine(line) {
        const tagsMatch = line.match(/\*\*Tags:\*\*\s+(.+)/);
        if (tagsMatch) {
            return tagsMatch[1].split(',').map(tag => tag.trim());
        }
        return [];
    }

    // Extract excerpt from metadata line
    extractExcerptFromLine(line) {
        const excerptMatch = line.match(/\*\*Excerpt:\*\*\s+(.+)/);
        return excerptMatch ? excerptMatch[1] : '';
    }

    // Extract slug from metadata line
    extractSlugFromLine(line) {
        const slugMatch = line.match(/\*\*Slug:\*\*\s+(.+)/);
        return slugMatch ? slugMatch[1].trim() : '';
    }

    // Process markdown content to HTML - Enhanced and more robust
    processMarkdown(content) {
        if (!content) return '';

        // Normalize line endings
        content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // First, protect code blocks and process them separately
        const codeBlocks = [];
        let codeBlockIndex = 0;
        
        // Extract and temporarily replace code blocks (more robust regex)
        content = content.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/g, (match, lang, code) => {
            codeBlocks.push({
                lang: (lang || '').toLowerCase().trim(),
                code: code.replace(/^\n+|\n+$/g, '') // Trim leading/trailing newlines
            });
            return `\n__CODE_BLOCK_${codeBlockIndex++}__\n`;
        });

        // Extract and temporarily replace inline code (more specific)
        const inlineCodes = [];
        let inlineCodeIndex = 0;
        content = content.replace(/`([^`\n]+)`/g, (match, code) => {
            inlineCodes.push(code.trim());
            return `__INLINE_CODE_${inlineCodeIndex++}__`;
        });

        // Process basic markdown
        let html = content
            // Headers (process before paragraphs)
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            
            // Bold and Italic (more specific)
            .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
            
            // Images (process before links to avoid conflicts)
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                return this.processImage(alt, src);
            })
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Process tables
        html = this.processTables(html);
        
        // Process lists
        html = this.processLists(html);
        
        // Process blockquotes
        html = this.processBlockquotes(html);
        
        // Process paragraphs and line breaks
        html = this.processParagraphs(html);
        
        // Restore inline code with proper escaping
        inlineCodes.forEach((code, index) => {
            html = html.replace(`__INLINE_CODE_${index}__`, `<code class="inline-code">${this.escapeHtml(code)}</code>`);
        });

        // Restore code blocks with enhanced structure
        codeBlocks.forEach((block, index) => {
            const langClass = block.lang ? ` class="language-${block.lang}"` : '';
            const langAttribute = block.lang ? ` data-language="${block.lang}"` : '';
            const preClass = block.lang ? `code-block language-${block.lang}` : 'code-block';
            
            html = html.replace(`__CODE_BLOCK_${index}__`, 
                `<pre class="${preClass}"${langAttribute}><code${langClass}>${this.escapeHtml(block.code)}</code></pre>`);
        });

        // Clean up extra whitespace and empty elements
        html = html
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
            .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs
            .replace(/(<pre[^>]*>)\s*\n/g, '$1') // Clean pre tag spacing
            .replace(/\n\s*(<\/pre>)/g, '$1'); // Clean pre tag spacing

        return html;
    }

    // Process tables separately for better handling
    processTables(content) {
        const lines = content.split('\n');
        const result = [];
        let inTable = false;
        let tableRows = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.includes('|') && line.split('|').length > 2) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                
                // Skip separator lines (like |---|---|)
                if (!line.match(/^\|[\s\-\|:]+\|$/)) {
                    const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
                    tableRows.push(cells);
                }
            } else {
                if (inTable && tableRows.length > 0) {
                    // Generate table HTML
                    let tableHtml = '<table class="markdown-table">';
                    tableRows.forEach((row, index) => {
                        const tag = index === 0 ? 'th' : 'td';
                        tableHtml += '<tr>';
                        row.forEach(cell => {
                            tableHtml += `<${tag}>${cell}</${tag}>`;
                        });
                        tableHtml += '</tr>';
                    });
                    tableHtml += '</table>';
                    result.push(tableHtml);
                    tableRows = [];
                    inTable = false;
                }
                result.push(line);
            }
        }

        // Handle table at end of content
        if (inTable && tableRows.length > 0) {
            let tableHtml = '<table class="markdown-table">';
            tableRows.forEach((row, index) => {
                const tag = index === 0 ? 'th' : 'td';
                tableHtml += '<tr>';
                row.forEach(cell => {
                    tableHtml += `<${tag}>${cell}</${tag}>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            result.push(tableHtml);
        }

        return result.join('\n');
    }

    // Process lists with better handling
    processLists(content) {
        const lines = content.split('\n');
        const result = [];
        let inList = false;
        let listItems = [];
        let isOrdered = false;

        for (let line of lines) {
            const trimmed = line.trim();
            const unorderedMatch = trimmed.match(/^[\-\*\+]\s+(.+)$/);
            const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);

            if (unorderedMatch || orderedMatch) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                    isOrdered = !!orderedMatch;
                }
                listItems.push(unorderedMatch ? unorderedMatch[1] : orderedMatch[1]);
            } else {
                if (inList && listItems.length > 0) {
                    const tag = isOrdered ? 'ol' : 'ul';
                    const listHtml = `<${tag} class="markdown-list">` +
                        listItems.map(item => `<li>${item}</li>`).join('') +
                        `</${tag}>`;
                    result.push(listHtml);
                    listItems = [];
                    inList = false;
                }
                result.push(line);
            }
        }

        // Handle list at end of content
        if (inList && listItems.length > 0) {
            const tag = isOrdered ? 'ol' : 'ul';
            const listHtml = `<${tag} class="markdown-list">` +
                listItems.map(item => `<li>${item}</li>`).join('') +
                `</${tag}>`;
            result.push(listHtml);
        }

        return result.join('\n');
    }

    // Process blockquotes with proper handling
    processBlockquotes(content) {
        const lines = content.split('\n');
        const result = [];
        let inBlockquote = false;
        let blockquoteLines = [];

        for (let line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('> ')) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                // Remove the '> ' prefix and add to blockquote content
                blockquoteLines.push(trimmed.substring(2));
            } else if (trimmed.startsWith('>') && trimmed.length === 1) {
                // Handle standalone '>' for empty lines in blockquotes
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                blockquoteLines.push('');
            } else {
                if (inBlockquote && blockquoteLines.length > 0) {
                    // Convert blockquote content and wrap in blockquote tags
                    const blockquoteContent = blockquoteLines.join('<br>').trim();
                    result.push(`<blockquote>${blockquoteContent}</blockquote>`);
                    blockquoteLines = [];
                    inBlockquote = false;
                }
                result.push(line);
            }
        }

        // Handle blockquote at end of content
        if (inBlockquote && blockquoteLines.length > 0) {
            const blockquoteContent = blockquoteLines.join('<br>').trim();
            result.push(`<blockquote>${blockquoteContent}</blockquote>`);
        }

        return result.join('\n');
    }

    // Process images with enhanced features
    processImage(alt, src) {
        // Handle relative paths for blog images
        let imageSrc = src;
        
        // Determine correct path based on current location
        let blogPostsBasePath = 'blog-posts/';
        
        // Check for base path override (for client-side navigation)
        if (window._blogBasePath) {
            blogPostsBasePath = `${window._blogBasePath}blog-posts/`;
        } else {
            const currentPath = window.location.pathname;
            
            // Check if we're in the blog section (including client-side routed blog posts)
            if (currentPath.startsWith('/blog')) {
                // For any blog-related path, we're serving from /blog/index.html
                blogPostsBasePath = '../blog-posts/';
            } else if (currentPath.endsWith('/about') || currentPath.endsWith('/contact') ||
                       currentPath.endsWith('/about/') || currentPath.endsWith('/contact/')) {
                blogPostsBasePath = '../blog-posts/';
            }
        }
        
        // Support multiple path formats
        if (src.startsWith('blog_images/')) {
            // Legacy format: blog_images/filename.ext
            imageSrc = `${blogPostsBasePath}${src}`;
        } else if (src.startsWith('images/')) {
            // New organized format: images/category/filename.ext
            imageSrc = `${blogPostsBasePath}${src}`;
        } else if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
            // Relative path without prefix, assume it's in blog-posts
            imageSrc = `${blogPostsBasePath}${src}`;
        }
        
        // Generate responsive image HTML with proper attributes
        const imageHTML = `<figure class="blog-image">
            <img src="${imageSrc}" 
                 alt="${this.escapeHtml(alt)}" 
                 loading="lazy"
                 class="responsive-image"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="image-error" style="display:none; padding: 20px; background: #f5f5f5; border: 1px dashed #ccc; text-align: center; color: #666;">
                <p>Image not found: ${this.escapeHtml(src)}</p>
            </div>
            ${alt ? `<figcaption class="image-caption">${this.escapeHtml(alt)}</figcaption>` : ''}
        </figure>`;
        
        return imageHTML;
    }

    // Process paragraphs and line breaks
    processParagraphs(content) {
        return content
            .split('\n\n')
            .map(block => {
                block = block.trim();
                if (!block) return '';
                
                // Don't wrap headers, tables, lists, blockquotes, images, or code blocks in paragraphs
                if (block.match(/^<(h[1-6]|table|[uo]l|blockquote|figure|pre|div)/)) {
                    return block;
                }
                
                // Convert single line breaks to <br> within paragraphs
                const processedBlock = block.replace(/\n/g, '<br>');
                return `<p>${processedBlock}</p>`;
            })
            .filter(block => block)
            .join('\n\n');
    }

    // Escape HTML characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

// Initialize markdown blog system
let markdownBlogCMS = null;
if (typeof window !== 'undefined') {
    markdownBlogCMS = new MarkdownBlogCMS();
}
