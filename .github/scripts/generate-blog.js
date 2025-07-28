const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function generateBlogIndex() {
  try {
    console.log('Generating blog posts index from markdown files...');
    
    const blogPostsDir = path.join(__dirname, '../../blog-posts');
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.md'));
    
    const blogPosts = [];
    
    for (const file of files) {
      const filePath = path.join(blogPostsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse markdown with gray-matter (for front matter) or custom parsing
      let frontMatter = {};
      let content = fileContent;
      
      try {
        const parsed = matter(fileContent);
        frontMatter = parsed.data;
        content = parsed.content;
        
        // If gray-matter didn't find any data, fallback to manual parsing
        if (Object.keys(frontMatter).length === 0) {
          frontMatter = parseManualMetadata(fileContent);
        }
      } catch (e) {
        // Fallback to manual parsing
        frontMatter = parseManualMetadata(fileContent);
      }
      
      const fileSlug = path.basename(file, '.md');
      const title = frontMatter.title || extractTitleFromContent(content);
      const excerpt = frontMatter.excerpt || extractExcerptFromContent(content);
      const date = frontMatter.date || extractDateFromContent(content) || new Date().toISOString();
      const tags = frontMatter.tags || extractTagsFromContent(content) || [];
      const postSlug = frontMatter.slug || fileSlug; // Use custom slug if available, fallback to filename
      
      blogPosts.push({
        slug: postSlug,
        fileSlug: fileSlug, // Keep original filename for file loading
        title,
        excerpt,
        date,
        tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
        url: `blog/${postSlug}`,
        author: {
          name: 'Aman Abdullayev',
          url: 'https://github.com/amanabdullayev'
        }
      });
    }
    
    // Sort by date (newest first)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write blog index
    const indexPath = path.join(__dirname, '../../js/blog-posts-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(blogPosts, null, 2));
    
    console.log(`Generated index for ${blogPosts.length} blog posts`);
    
  } catch (error) {
    console.error('Error generating blog index:', error);
    process.exit(1);
  }
}

function parseManualMetadata(content) {
  const metadata = {};
  const lines = content.split('\n');
  
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
    }
  }
  
  return metadata;
}

function extractTitleFromContent(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 'Untitled Post';
}

function extractExcerptFromContent(content) {
  // First try to find explicit excerpt from metadata parsing
  const excerptMatch = content.match(/\*\*Excerpt:\*\*\s+(.+)/);
  if (excerptMatch) {
    return excerptMatch[1].trim();
  }
  
  // Fallback: Remove markdown formatting and get first paragraph
  const plainText = content
    .replace(/#+\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
  
  const sentences = plainText.split('.').filter(s => s.trim().length > 0);
  const excerpt = sentences.slice(0, 2).join('.').trim();
  
  return excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt + '.';
}

function extractDateFromContent(content) {
  const dateMatch = content.match(/\*\*Published:\*\*\s+(.+)/);
  if (dateMatch) {
    try {
      return new Date(dateMatch[1]).toISOString();
    } catch (e) {
      return null;
    }
  }
  return null;
}

function extractTagsFromContent(content) {
  const tagsMatch = content.match(/\*\*Tags:\*\*\s+(.+)/);
  if (tagsMatch) {
    return tagsMatch[1].split(',').map(tag => tag.trim());
  }
  return [];
}

// Run the script
generateBlogIndex();
