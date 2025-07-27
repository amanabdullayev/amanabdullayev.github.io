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
            const response = await fetch('js/blog-posts-index.json');
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
            const response = await fetch(`${this.blogPostsPath}${slug}.md`);
            if (!response.ok) {
                throw new Error(`Blog post not found: ${slug}`);
            }
            
            const markdown = await response.text();
            return this.parseMarkdownPost(markdown, slug);
        } catch (error) {
            console.error('Failed to load blog post:', error);
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

        return {
            slug,
            ...metadata,
            content: this.processMarkdown(content),
            rawContent: content,
            url: `blog-post.html?post=${slug}`,
            id: slug,
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

    // Process markdown content to HTML
    processMarkdown(content) {
        if (!content) return '';

        // First, protect code blocks and process them separately
        const codeBlocks = [];
        let codeBlockIndex = 0;
        
        // Extract and temporarily replace code blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            codeBlocks.push({
                lang: lang || '',
                code: code.trim()
            });
            return `__CODE_BLOCK_${codeBlockIndex++}__`;
        });

        // Extract and temporarily replace inline code
        const inlineCodes = [];
        let inlineCodeIndex = 0;
        content = content.replace(/`([^`\n]+)`/g, (match, code) => {
            inlineCodes.push(code);
            return `__INLINE_CODE_${inlineCodeIndex++}__`;
        });

        // Process basic markdown
        let html = content
            // Headers (process before paragraphs)
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            
            // Bold and Italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Process tables
        html = this.processTables(html);
        
        // Process lists
        html = this.processLists(html);
        
        // Process paragraphs and line breaks
        html = this.processParagraphs(html);
        
        // Restore inline code
        inlineCodes.forEach((code, index) => {
            html = html.replace(`__INLINE_CODE_${index}__`, `<code class="inline-code">${this.escapeHtml(code)}</code>`);
        });

        // Restore code blocks
        codeBlocks.forEach((block, index) => {
            const langClass = block.lang ? ` class="language-${block.lang}"` : '';
            const langAttribute = block.lang ? ` data-language="${block.lang}"` : '';
            html = html.replace(`__CODE_BLOCK_${index}__`, 
                `<pre class="code-block"${langAttribute}><code${langClass}>${this.escapeHtml(block.code)}</code></pre>`);
        });

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

    // Process paragraphs and line breaks
    processParagraphs(content) {
        return content
            .split('\n\n')
            .map(block => {
                block = block.trim();
                if (!block) return '';
                
                // Don't wrap headers, tables, lists, or code blocks in paragraphs
                if (block.match(/^<(h[1-6]|table|[uo]l|pre|div)/)) {
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
