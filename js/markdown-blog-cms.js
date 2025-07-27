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

        return content
            // Code blocks with language support
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            
            // Bold and Italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            
            // Lists
            .replace(/^\- (.+)$/gm, '<li>$1</li>')
            .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            
            // Tables (basic support)
            .replace(/\|(.+)\|/g, (match, content) => {
                const cells = content.split('|').map(cell => cell.trim()).filter(cell => cell);
                return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
            })
            .replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>')
            
            // Line breaks and paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            
            // Clean up
            .replace(/<p><\/p>/g, '')
            .replace(/<p><br><\/p>/g, '')
            .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
            .replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1')
            .replace(/<p>(<table>.*<\/table>)<\/p>/g, '$1')
            .replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1');
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
