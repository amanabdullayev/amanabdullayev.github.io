// Markdown Blog System - Reads .md files from blog-posts folder
class MarkdownBlogCMS {
    constructor() {
        this.cache = new Map();
        this.cacheTime = 5 * 60 * 1000; // 5 minutes
        this.blogPostsPath = 'blog-posts/';
    }

    // Get list of all blog posts
    async getBlogPosts() {
        const cacheKey = 'markdown-blog-posts';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTime) {
            return cached.data;
        }

        try {
            // Get list of markdown files (this will be populated by build process or manually)
            const blogPosts = await this.loadBlogPostsIndex();
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: blogPosts,
                timestamp: Date.now()
            });

            return blogPosts;
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            return [];
        }
    }

    // Load blog posts index (contains metadata for all posts)
    async loadBlogPostsIndex() {
        try {
            // Try to load from generated index file
            const response = await fetch('js/blog-posts-index.json');
            if (response.ok) {
                const posts = await response.json();
                return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        } catch (error) {
            console.warn('Blog posts index not found, using manual list');
        }

        // Fallback to manual list of blog posts
        return this.getManualBlogPostsList();
    }

    // Manual list of blog posts (update this when adding new posts)
    getManualBlogPostsList() {
        return [
            {
                slug: 'getting-started-with-marketing-analytics',
                title: 'Getting Started with Marketing Analytics',
                excerpt: 'As an Applied Scientist working in performance marketing, I\'ve learned that the key to successful marketing analytics lies in understanding both the technical aspects and the business context.',
                date: '2025-07-20T10:00:00Z',
                tags: ['marketing-analytics', 'data-science', 'mmm', 'attribution'],
                author: {
                    name: 'Aman Abdullayev',
                    avatar: 'https://github.com/amanabdullayev.png',
                    url: 'https://github.com/amanabdullayev'
                }
            },
            {
                slug: 'journey-environmental-science-to-data-science',
                title: 'My Journey from Environmental Science to Data Science',
                excerpt: 'When I started my career in environmental science, I never imagined I\'d end up as an Applied Scientist at Zalando. Life has a funny way of taking unexpected turns.',
                date: '2025-07-15T14:30:00Z',
                tags: ['career', 'personal', 'data-science', 'academia', 'transition'],
                author: {
                    name: 'Aman Abdullayev',
                    avatar: 'https://github.com/amanabdullayev.png',
                    url: 'https://github.com/amanabdullayev'
                }
            },
            {
                slug: 'building-robust-attribution-models',
                title: 'Building Robust Attribution Models: Lessons Learned',
                excerpt: 'After building multiple attribution models at Haensel AMS and now at Zalando, I\'ve learned some valuable lessons about what works and what doesn\'t.',
                date: '2025-07-10T09:15:00Z',
                tags: ['attribution-modeling', 'data-science', 'technical', 'machine-learning'],
                author: {
                    name: 'Aman Abdullayev',
                    avatar: 'https://github.com/amanabdullayev.png',
                    url: 'https://github.com/amanabdullayev'
                }
            }
        ];
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
                name: 'Aman Abdullayev',
                avatar: 'https://github.com/amanabdullayev.png',
                url: 'https://github.com/amanabdullayev'
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

    // Generate blog posts index for build process
    generateBlogPostsIndex() {
        return this.getManualBlogPostsList();
    }
}

// Initialize markdown blog system
let markdownBlogCMS = null;
if (typeof window !== 'undefined') {
    markdownBlogCMS = new MarkdownBlogCMS();
}
