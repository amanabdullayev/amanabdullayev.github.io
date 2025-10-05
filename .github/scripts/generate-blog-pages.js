const fs = require('fs');
const path = require('path');

// Simple markdown processor for Node.js (since we can't use the browser version)
class NodeMarkdownProcessor {
    processMarkdown(content) {
        if (!content) return '';

        // Normalize line endings
        content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // First, protect code blocks
        const codeBlocks = [];
        let codeBlockIndex = 0;
        content = content.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/g, (match, lang, code) => {
            codeBlocks.push({
                lang: (lang || '').toLowerCase().trim(),
                code: code.replace(/^\n+|\n+$/g, '')
            });
            return `\n__CODE_BLOCK_${codeBlockIndex++}__\n`;
        });

        // Protect LaTeX equations
        const mathEquations = [];
        let mathIndex = 0;
        
        // Protect display math ($$...$$) first
        content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
            mathEquations.push(match);
            return `\n<!--MATHJAX_DISPLAY_${mathIndex++}-->\n`;
        });
        
        // Protect inline math ($...$) 
        content = content.replace(/\$([^$\n\r]+)\$/g, (match, equation) => {
            mathEquations.push(match);
            return `<!--MATHJAX_INLINE_${mathIndex++}-->`;
        });

        // Extract and temporarily replace inline code
        const inlineCodes = [];
        let inlineCodeIndex = 0;
        content = content.replace(/`([^`\n]+)`/g, (match, code) => {
            inlineCodes.push(code.trim());
            return `__INLINE_CODE_${inlineCodeIndex++}__`;
        });

        // Process basic markdown
        let html = content
            // Headers (process from h6 to h1 to avoid conflicts)
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            
            // Bold and Italic
            .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
            
            // Images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                return this.processImage(alt, src);
            })
            
            // YouTube video previews (process before general links)
            // Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
            .replace(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:[?&][^\)]*)?)\)/g, (match, title, url, videoId) => {
                return this.processYouTubeLink(title, url, videoId);
            })
            
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Process tables
        html = this.processTables(html);
        
        // Process lists
        html = this.processLists(html);
        
        // Process blockquotes
        html = this.processBlockquotes(html);
        
        // Restore code blocks BEFORE processing paragraphs
        codeBlocks.forEach((block, index) => {
            const langClass = block.lang ? ` class="language-${block.lang}"` : '';
            const langAttribute = block.lang ? ` data-language="${block.lang}"` : '';
            const preClass = block.lang ? `code-block language-${block.lang}` : 'code-block';
            const displayLang = block.lang ? block.lang : 'code';
            const codeLength = block.code.split('\n').length;
            
            // Only add toggle functionality for code blocks that are more than 10 lines
            if (codeLength > 10) {
                html = html.replace(`__CODE_BLOCK_${index}__`, 
                    `<div class="code-block-wrapper">
                        <div class="code-block-header">
                            <span class="code-block-language">${displayLang}</span>
                            <button class="code-block-toggle" aria-expanded="false">Show code (${codeLength} lines)</button>
                        </div>
                        <div class="code-block-container collapsed">
                            <pre class="${preClass}"${langAttribute}><code${langClass}>${this.escapeHtml(block.code)}</code></pre>
                        </div>
                    </div>`);
            } else {
                html = html.replace(`__CODE_BLOCK_${index}__`, 
                    `<div class="code-block-wrapper">
                        <div class="code-block-header">
                            <span class="code-block-language">${displayLang}</span>
                        </div>
                        <div class="code-block-container">
                            <pre class="${preClass}"${langAttribute}><code${langClass}>${this.escapeHtml(block.code)}</code></pre>
                        </div>
                    </div>`);
            }
        });
        
        // Process paragraphs (after code blocks are restored)
        html = this.processParagraphs(html);
        
        // Restore inline code
        inlineCodes.forEach((code, index) => {
            html = html.replace(`__INLINE_CODE_${index}__`, `<code class="inline-code">${this.escapeHtml(code)}</code>`);
        });

        // Restore math equations (preserve as-is for MathJax) - do this LAST
        mathEquations.forEach((equation, index) => {
            html = html.replace(`<!--MATHJAX_DISPLAY_${index}-->`, equation);
            html = html.replace(`<!--MATHJAX_INLINE_${index}-->`, equation);
        });

        return html;
    }

    processImage(alt, src) {
        // Adjust paths for blog posts
        let imageSrc = src;
        if (src.startsWith('blog_images/') || src.startsWith('images/')) {
            imageSrc = `../../blog-posts/${src}`;
        } else if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
            imageSrc = `../../blog-posts/${src}`;
        }

        return `<figure class="blog-image">
            <img src="${imageSrc}" 
                 alt="${this.escapeHtml(alt)}" 
                 loading="lazy"
                 class="responsive-image">
            ${alt ? `<figcaption class="image-caption">${this.escapeHtml(alt)}</figcaption>` : ''}
        </figure>`;
    }

    processYouTubeLink(title, url, videoId) {
        return `<div class="youtube-video">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    title="${this.escapeHtml(title)}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
            <p class="video-title">${this.escapeHtml(title)}</p>
        </div>`;
    }

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

        if (inList && listItems.length > 0) {
            const tag = isOrdered ? 'ol' : 'ul';
            const listHtml = `<${tag} class="markdown-list">` +
                listItems.map(item => `<li>${item}</li>`).join('') +
                `</${tag}>`;
            result.push(listHtml);
        }

        return result.join('\n');
    }

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
                blockquoteLines.push(trimmed.substring(2));
            } else if (trimmed.startsWith('>') && trimmed.length === 1) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                blockquoteLines.push('');
            } else {
                if (inBlockquote && blockquoteLines.length > 0) {
                    const blockquoteContent = blockquoteLines.join('<br>').trim();
                    result.push(`<blockquote>${blockquoteContent}</blockquote>`);
                    blockquoteLines = [];
                    inBlockquote = false;
                }
                result.push(line);
            }
        }

        if (inBlockquote && blockquoteLines.length > 0) {
            const blockquoteContent = blockquoteLines.join('<br>').trim();
            result.push(`<blockquote>${blockquoteContent}</blockquote>`);
        }

        return result.join('\n');
    }

    processParagraphs(content) {
        return content
            .split('\n\n')
            .map(block => {
                block = block.trim();
                if (!block) return '';
                
                // Don't wrap headers, tables, lists, blockquotes, images, code blocks, or placeholders in paragraphs
                if (block.match(/^<(h[1-6]|table|[uo]l|blockquote|figure|pre|div)/)) {
                    return block;
                }
                
                // Don't wrap code block placeholders
                if (block.match(/^__CODE_BLOCK_\d+__$/)) {
                    return block;
                }
                
                // Don't wrap MathJax placeholders
                if (block.match(/^<!--MATHJAX_\w+_\d+-->$/)) {
                    return block;
                }
                
                const processedBlock = block.replace(/\n/g, '<br>');
                return `<p>${processedBlock}</p>`;
            })
            .filter(block => block)
            .join('\n\n');
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    extractMetadata(content) {
        const lines = content.split('\n');
        const metadata = {};
        let contentStart = 0;

        for (let i = 0; i < Math.min(10, lines.length); i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('**Published:**')) {
                const dateMatch = line.match(/\*\*Published:\*\*\s+(.+)/);
                if (dateMatch) {
                    metadata.date = new Date(dateMatch[1]).toISOString();
                }
            } else if (line.startsWith('**Tags:**')) {
                const tagsMatch = line.match(/\*\*Tags:\*\*\s+(.+)/);
                if (tagsMatch) {
                    metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
                }
            } else if (line.startsWith('**Excerpt:**')) {
                const excerptMatch = line.match(/\*\*Excerpt:\*\*\s+(.+)/);
                if (excerptMatch) {
                    metadata.excerpt = excerptMatch[1];
                }
            } else if (line.startsWith('**Slug:**')) {
                const slugMatch = line.match(/\*\*Slug:\*\*\s+(.+)/);
                if (slugMatch) {
                    metadata.slug = slugMatch[1].trim();
                }
            } else if (line.startsWith('**Cover Image Path:**')) {
                const coverImageMatch = line.match(/\*\*Cover Image Path:\*\*\s+(.+)/);
                if (coverImageMatch) {
                    metadata.coverImage = coverImageMatch[1].trim();
                }
            } else if (line === '---' && i > 0) {
                contentStart = i + 1;
                break;
            }
        }

        // Extract title from first h1
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1];
        }

        // Get content after metadata
        const mainContent = lines.slice(contentStart).join('\n');

        return { metadata, content: mainContent };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Read the blog posts index to get all slugs
const blogIndexPath = path.join(__dirname, '../../js/blog-posts-index.json');

// Check if blog index exists
if (!fs.existsSync(blogIndexPath)) {
    console.error('Blog posts index not found. Please run generate-blog-index.js first.');
    process.exit(1);
}

const blogPosts = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
const markdownProcessor = new NodeMarkdownProcessor();

// Utility function to generate consistent colors for tags (same as main.js)
function getTagColorIndex(tagName) {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        const char = tagName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 10; // Return index between 0-9
}

// Template function for blog post index.html
function createBlogPostTemplate(post, renderedContent) {
    const formattedDate = markdownProcessor.formatDate(post.date);
    const tagsHtml = post.tags ? post.tags.map(tag => {
        const colorIndex = getTagColorIndex(tag);
        return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
    }).join('') : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Aman Abdullayev</title>
    <meta name="description" content="${post.excerpt || 'A blog post by Aman Abdullayev'}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title} - Aman Abdullayev">
    <meta property="og:description" content="${post.excerpt || 'A blog post by Aman Abdullayev'}">
    <meta property="og:url" content="https://amanabdullayev.me/blog/${post.slug}/">
    <meta property="og:site_name" content="Aman Abdullayev - Portfolio">
    ${post.coverImage ? `<meta property="og:image" content="https://amanabdullayev.me/blog-posts/${post.coverImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/png">` : '<meta property="og:image" content="https://amanabdullayev.me/images/logo.png">'}
    <meta property="article:author" content="Aman Abdullayev">
    <meta property="article:published_time" content="${post.date}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="${post.coverImage ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${post.title} - Aman Abdullayev">
    <meta name="twitter:description" content="${post.excerpt || 'A blog post by Aman Abdullayev'}">
    <meta name="twitter:creator" content="@amanabdullayev">
    ${post.coverImage ? `<meta name="twitter:image" content="https://amanabdullayev.me/blog-posts/${post.coverImage}">` : '<meta name="twitter:image" content="https://amanabdullayev.me/images/logo.png">'}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://amanabdullayev.me/blog/${post.slug}/">
    
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="../../public/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../../public/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../../public/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../../public/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../../public/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../../public/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../../public/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../../public/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../../public/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="../../public/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../public/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../../public/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../public/favicon-16x16.png">
    <link rel="manifest" href="../../public/manifest.json">
    <meta name="msapplication-TileColor" content="#2563eb">
    <meta name="msapplication-TileImage" content="../../public/ms-icon-144x144.png">
    <meta name="theme-color" content="#2563eb">
    
    <!-- Core styles -->
    <link rel="stylesheet" href="../../styles/core.css">
    <link rel="stylesheet" href="../../styles/layout.css">
    <link rel="stylesheet" href="../../styles/components.css">
    <link rel="stylesheet" href="../../styles/blog.css">
    <link rel="stylesheet" href="../../styles/pages.css">
    <link rel="stylesheet" href="../../styles/responsive.css">
    
    <!-- Prism.js CSS for syntax highlighting - Use Tomorrow theme which works better with dark mode -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    
    <!-- MathJax for LaTeX equation rendering -->
    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true,
                tags: 'ams'
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            },
            startup: {
                pageReady: () => {
                    console.log('MathJax configuration loaded');
                    return MathJax.startup.defaultPageReady().then(() => {
                        console.log('MathJax page ready');
                        // Force a re-render for GitHub Pages
                        if (window.MathJax && window.MathJax.typesetPromise) {
                            return window.MathJax.typesetPromise();
                        }
                    });
                }
            },
            loader: {
                load: ['[tex]/ams']
            }
        };
    </script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <a href="../../" class="logo">
                    <img src="../../images/logo.png" alt="Aman Abdullayev Logo" class="logo-image">
                    Aman's Space
                </a>
                <div class="nav-buttons">
                    <a href="../../about" class="nav-btn">About</a>
                    <a href="../../blog" class="nav-btn active">Blog</a>
                    <a href="../../contact" class="nav-btn">Contact</a>
                    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                        <span class="theme-icon">☀️</span>
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <main class="container">
        <article class="blog-post">
            <!-- Back to blog link -->
            <div class="blog-post-nav">
                <a href="../" class="back-to-blog">← Back to Blog</a>
            </div>
            <!-- Cover image banner -->
            ${post.coverImage ? `
            <div class="blog-post-cover">
                <img src="../../blog-posts/${post.coverImage}" 
                     alt="${post.title}" 
                     class="cover-image"
                     loading="lazy">
            </div>
            ` : ''}
            <!-- Post header -->
            <header class="blog-post-header">
                <h1 class="blog-post-title">${post.title}</h1>
                <div class="post-tags">${tagsHtml}</div>
                <div class="blog-post-meta">
                    <time datetime="${post.date}">${formattedDate}</time>
                    <div class="page-views" id="page-views">
                        📊 Loading...
                    </div>
                </div>
                <div class="post-author-pin">
                    <img src="../../images/personal_avatar_1.png" 
                         alt="Aman Abdullayev" 
                         class="author-avatar"
                         loading="lazy">
                    <span class="author-pin-name">Aman Abdullayev</span>
                </div>
            </header>

            <!-- Post content -->
            <div class="blog-post-body">
                ${renderedContent}
            </div>

            <!-- Post footer -->
            <footer class="blog-post-footer">
                <div class="post-sharing">
                    <h4>Share this post:</h4>
                    <div class="share-buttons">
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://amanabdullayev.me/blog/${post.slug}/`)}" target="_blank" class="share-btn twitter">
                            🐦 Twitter
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://amanabdullayev.me/blog/${post.slug}/`)}" target="_blank" class="share-btn linkedin">
                            💼 LinkedIn
                        </a>
                        <a href="#" onclick="navigator.clipboard.writeText(window.location.href); this.textContent='✅ Copied!'; setTimeout(() => this.textContent='📋 Copy Link', 2000); return false;" class="share-btn copy">
                            📋 Copy Link
                        </a>
                    </div>
                </div>
                
                <div class="post-navigation">
                    <a href="../" class="btn btn-secondary">← Back to All Posts</a>
                </div>
            </footer>
        </article>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <p>&copy; 2024 Aman Abdullayev. All rights reserved.</p>
                </div>
                <div class="footer-links">
                    <a href="../../">Home</a>
                    <a href="../../about">About</a>
                    <a href="../../blog">Blog</a>
                    <a href="../../contact">Contact</a>
                    <button id="footer-theme-toggle" class="theme-toggle footer-theme-toggle" aria-label="Toggle theme">
                        <span class="theme-icon">☀️</span>
                    </button>
                </div>
            </div>
        </div>
    </footer>

    <!-- Configuration Scripts -->
    <script src="../../js/env-config.js"></script>
    <script src="../../js/config-public.js"></script>
    <script src="../../js/main.js"></script>
    
    <!-- Prism.js for syntax highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-yaml.min.js"></script>
    
    <!-- Blog post functionality - load after Prism -->
    <script src="../../js/blog-post.js"></script>
    
    <!-- Simple page view counter -->
    <script>
        fetch('https://amanabdullayev.goatcounter.com/counter/blog/${post.slug}/.json')
            .then(response => response.json())
            .then(data => {
                const el = document.getElementById('page-views');
                if (el && data.count) {
                    el.textContent = '📊 ' + data.count + ' views';
                }
            })
            .catch(() => {
                document.getElementById('page-views').style.display = 'none';
            });
    </script>
</body>
</html>`;
}

// Create directories and index.html files for each blog post
const currentSlugs = new Set(blogPosts.map(post => post.slug));
const blogDir = path.join(__dirname, '../../blog');

// Clean up old blog post directories that no longer exist
if (fs.existsSync(blogDir)) {
    const existingDirs = fs.readdirSync(blogDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    existingDirs.forEach(dirName => {
        if (!currentSlugs.has(dirName)) {
            const oldDirPath = path.join(blogDir, dirName);
            fs.rmSync(oldDirPath, { recursive: true, force: true });
            console.log(`Removed old blog directory: ${oldDirPath}`);
        }
    });
}

// Create directories and index.html files for each blog post
blogPosts.forEach(post => {
    const slugDir = path.join(__dirname, '../../blog', post.slug);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(slugDir)) {
        fs.mkdirSync(slugDir, { recursive: true });
    }
    
    // Read and process the markdown file
    const markdownPath = path.join(__dirname, '../../blog-posts', `${post.fileSlug}.md`);
    
    try {
        if (!fs.existsSync(markdownPath)) {
            console.error(`Markdown file not found: ${markdownPath}`);
            return;
        }
        
        const markdownContent = fs.readFileSync(markdownPath, 'utf8');
        const { metadata, content } = markdownProcessor.extractMetadata(markdownContent);
        
        // Use extracted metadata or fallback to post data
        const postData = {
            title: metadata.title || post.title,
            slug: post.slug,
            date: metadata.date || post.date,
            excerpt: metadata.excerpt || post.excerpt,
            tags: metadata.tags || post.tags,
            coverImage: metadata.coverImage || post.coverImage
        };
        
        // Render markdown to HTML
        const renderedContent = markdownProcessor.processMarkdown(content);
        
        // Generate static HTML
        const staticHtml = createBlogPostTemplate(postData, renderedContent);
        
        // Write index.html file
        const indexPath = path.join(slugDir, 'index.html');
        fs.writeFileSync(indexPath, staticHtml);
        
        console.log(`Created ${indexPath} with pre-rendered content`);
        
    } catch (error) {
        console.error(`Error processing ${post.slug}:`, error.message);
    }
});

console.log(`Generated static blog post pages for ${blogPosts.length} posts`);
