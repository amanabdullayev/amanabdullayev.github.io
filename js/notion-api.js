// Notion API Integration
class NotionAPI {
    constructor(token, databaseId) {
        this.token = token;
        this.databaseId = databaseId;
        this.baseUrl = 'https://api.notion.com/v1';
        this.version = '2022-06-28';
    }

    // Helper method to make API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Notion-Version': this.version,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Notion API request failed:', error);
            throw error;
        }
    }

    // Get all published blog posts
    async getBlogPosts() {
        try {
            const response = await this.request(`/databases/${this.databaseId}/query`, {
                method: 'POST',
                body: JSON.stringify({
                    filter: {
                        property: 'Published',
                        checkbox: {
                            equals: true
                        }
                    },
                    sorts: [
                        {
                            property: 'Date',
                            direction: 'descending'
                        }
                    ]
                })
            });

            return response.results.map(page => this.formatBlogPost(page));
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            return [];
        }
    }

    // Get page content
    async getPageContent(pageId) {
        try {
            const response = await this.request(`/blocks/${pageId}/children`);
            return this.formatPageContent(response.results);
        } catch (error) {
            console.error('Failed to fetch page content:', error);
            return '';
        }
    }

    // Format blog post data from Notion
    formatBlogPost(page) {
        const properties = page.properties;
        
        return {
            id: page.id,
            title: this.extractText(properties.Title),
            excerpt: this.extractText(properties.Excerpt) || 'No excerpt available',
            date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
            tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
            url: page.url,
            published: properties.Published?.checkbox || false
        };
    }

    // Extract plain text from Notion rich text
    extractText(richTextProperty) {
        if (!richTextProperty || !richTextProperty.title && !richTextProperty.rich_text) {
            return '';
        }
        
        const textArray = richTextProperty.title || richTextProperty.rich_text || [];
        return textArray.map(text => text.plain_text).join('');
    }

    // Format page content blocks
    formatPageContent(blocks) {
        return blocks.map(block => {
            switch (block.type) {
                case 'paragraph':
                    const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
                    return `<p>${text}</p>`;
                
                case 'heading_1':
                    const h1Text = block.heading_1.rich_text.map(t => t.plain_text).join('');
                    return `<h1>${h1Text}</h1>`;
                
                case 'heading_2':
                    const h2Text = block.heading_2.rich_text.map(t => t.plain_text).join('');
                    return `<h2>${h2Text}</h2>`;
                
                case 'heading_3':
                    const h3Text = block.heading_3.rich_text.map(t => t.plain_text).join('');
                    return `<h3>${h3Text}</h3>`;
                
                case 'bulleted_list_item':
                    const listText = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
                    return `<li>${listText}</li>`;
                
                case 'numbered_list_item':
                    const numberedText = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
                    return `<li>${numberedText}</li>`;
                    
                case 'code':
                    const codeText = block.code.rich_text.map(t => t.plain_text).join('');
                    const language = block.code.language || '';
                    return `<pre><code class="language-${language}">${codeText}</code></pre>`;
                
                default:
                    return '';
            }
        }).join('\n');
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

// Initialize Notion API if config is available
let notionAPI = null;
if (typeof CONFIG !== 'undefined' && CONFIG.notion.token && CONFIG.notion.databaseId) {
    notionAPI = new NotionAPI(CONFIG.notion.token, CONFIG.notion.databaseId);
}
