**Published:** July 27, 2025
**Tags:** testing, markdown, code-examples
**Excerpt:** Testing the enhanced markdown rendering with code blocks, tables, and lists to ensure everything displays properly.

# Markdown Rendering Test

This is a test post to demonstrate the improved markdown rendering capabilities.

## Code Examples

Here's some **JavaScript** code with proper syntax highlighting:

```javascript
function processMarkdown(content) {
    if (!content) return '';
    
    // Process code blocks with enhanced handling
    const codeBlocks = [];
    let codeBlockIndex = 0;
    
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        codeBlocks.push({ 
            lang: lang || '', 
            code: code.trim() 
        });
        return `__CODE_BLOCK_${codeBlockIndex++}__`;
    });
}

// Example usage
const markdown = "```js\nconsole.log('Hello World');\n```";
const html = processMarkdown(markdown);
console.log(html);
```

And here's some **Python** code:

```python
def generate_blog_index():
    """Generate a blog index from markdown files"""
    posts = []
    
    for file in os.listdir('blog-posts'):
        if file.endswith('.md'):
            with open(f'blog-posts/{file}', 'r') as f:
                content = f.read()
                posts.append(parse_post(content))
    
    return sorted(posts, key=lambda x: x['date'], reverse=True)

# Example with error handling
try:
    index = generate_blog_index()
    print(f"Generated index with {len(index)} posts")
except Exception as e:
    print(f"Error generating index: {e}")
```

Some **CSS** for styling:

```css
.code-block {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    font-family: 'Monaco', 'Menlo', monospace;
}

.inline-code {
    background: var(--bg-secondary);
    color: var(--accent-primary);
    padding: 0.2em 0.4em;
    border-radius: 4px;
}
```

## Tables

Here's a comparison table:

| Feature | Before | After | Improvement |
|---------|--------|-------|-------------|
| Code Highlighting | None | Prism.js | ✅ Full syntax highlighting |
| Tables | Broken | Styled | ✅ Professional table styling |
| Lists | Basic | Enhanced | ✅ Better spacing and styling |
| Performance | Slow | Fast | ✅ Optimized processing |

## Lists

### Unordered List
- Enhanced markdown processing
- Proper code block handling
- Beautiful table rendering
- Responsive design
- Dark/light theme support

### Ordered List
1. Load markdown content
2. Extract code blocks safely
3. Process basic markdown elements
4. Restore code blocks with highlighting
5. Apply CSS styling

## Inline Elements

This paragraph contains `inline code` and **bold text** and *italic text* and [a link](https://example.com).

## Conclusion

The markdown rendering is now significantly improved with proper code highlighting, table styling, and enhanced typography!
