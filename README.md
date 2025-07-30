# Portfolio Website

A modern, responsive portfolio website with dark/light theme toggle and optimized markdown-based blog system.

## 🚀 Features

- **Multi-page Portfolio**: Home, About, Blog, Contact pages with clean URLs
- **Clean URL Structure**: SEO-friendly URLs without .html extensions
- **Dark/Light Theme**: Complete theme system with localStorage persistence
- **Hybrid Blog System**: Static page generation + client-side interactivity for optimal performance
- **Responsive Design**: Mobile-first approach with fullscreen blog posts
- **GitHub Actions**: Automated deployment workflow with modern actions
- **Performance Optimized**: Static pages with reduced client-side JavaScript (~70% reduction)



## ✍️ Blog System

### Architecture

The blog system uses a **hybrid approach** combining build-time generation with client-side interactivity:

- **Build-time**: Markdown files are processed during GitHub Actions deployment to generate static HTML pages
- **Client-side**: Blog listing, search, filtering, and tag management handled by JavaScript for dynamic user experience
- **Static Pages**: Each blog post gets its own directory with pre-rendered HTML for fast loading and SEO

### Build Process

The `.github/scripts/generate-blog-pages.js` script processes markdown files during deployment:

1. **Markdown Processing**: Converts `.md` files to HTML with full markdown support (tables, code blocks, links, etc.)
2. **Static Page Generation**: Creates individual `blog/[slug]/index.html` files for each post
3. **Index Generation**: Updates `blog-posts-index.json` for client-side blog listing functionality

### Client-side Blog Management

The `js/blog-index.js` file handles dynamic blog functionality:

- **Blog Listing**: Fetches and displays blog posts from the generated index
- **Search & Filtering**: Real-time search and tag-based filtering
- **Tag Management**: Colorful tag system with 10 distinct color schemes
- **Pagination**: Efficient pagination for large numbers of posts


### Blog Features

- **Static Page Generation**: Pre-rendered HTML pages for fast loading and SEO optimization
- **Build-time Markdown Processing**: Full markdown support including tables, code blocks, and custom elements
- **Client-side Interactivity**: Search, filtering, and tag management without page reloads
- **Colorful Tag System**: 10 distinct color schemes for tags with light/dark theme support
- **Fullscreen Reading**: Wide containers (900px-1000px) for better reading experience
- **Excerpt Prioritization**: Uses explicit excerpts from metadata over auto-generated content
- **Privacy-First**: No external avatars or tracking pixels
- **Mobile Optimized**: Responsive design with smooth scrolling
- **Clean URLs**: SEO-friendly URLs with custom slugs (e.g., `/blog/my-awesome-post`)

### URL Structure

The blog system uses clean, SEO-friendly URLs:

- **Format**: `https://yoursite.com/blog/custom-slug`

Each blog post gets its own directory with an `index.html` file, making URLs analytics-friendly for tools like Counter.dev. The system automatically generates static pages during the GitHub Actions deployment process.

**Custom Slugs**: Use the `**Slug:**` metadata field to create custom URLs. If no slug is provided, the filename (without `.md`) will be used as the default slug.

## 🛠️ Development


1. **Download all files** and organize them in the structure shown above
2. **Configure your personal information** in `js/config-public.js`
4. **Deploy your website** to any web hosting service, preferably Github Pages


## Personal Configuration

Edit `js/config-public.js` to customize your website:

### Basic Information
```javascript
personal: {
    name: "Your Full Name",
    title: "Your Professional Title",
    description: "Brief description for hero section",
    intro: "What you do - appears on home page",
    aboutMe: `<p>Your detailed story for about page...</p>`
}
```

### Home Page Stats
```javascript
homeStats: [
    {
        icon: "💻",
        title: "Active Projects", 
        description: "Currently working on 3 exciting projects"
    },
    // Add more stats...
]
```

### Skills (for About page)
```javascript
skills: [
    {
        icon: "⚛️",
        name: "React/Next.js",
        level: "Advanced"
    },
    // Add more skills...
]
```

### Experience Timeline
```javascript
experience: [
    {
        date: "2023 - Present",
        title: "Senior Software Engineer",
        company: "Tech Company Name",
        description: "Your role description..."
    },
    // Add more experience...
]
```

### Contact Information
```javascript
contact: [
    {
        name: "Email",
        icon: "📧",
        url: "mailto:your.email@example.com"
    },
    // Add more contact methods...
]
```
## Creating Blog Posts

1. Create a new `.md` file in the `blog-posts/` directory
2. Add metadata at the top of your markdown file:

```markdown
**Published:** July 15, 2025
**Tags:** data-science, analytics, marketing
**Excerpt:** Brief description of your post that will appear in listings...
**Slug:** custom-url-slug

# Your Blog Post Title

Your blog content here using standard markdown...
```

3. The build process automatically generates static HTML pages and updates the blog index
4. Individual post pages are served as static files for optimal performance


## Improvement Ideas
- Cover images for each blog post
- Ensure full excerpt is shown as preview of a blog
- ~~Analytics integration~~ ✅ **COMPLETED** GoatCounter
- ~~Blog view counter~~ ✅ **COMPLETED** get GoatCounter stats
- Fix Social link sharing preview images
- Check SEO optimization
- Commenting system for blog posts




## 📄 License

This project is open source and available under the [MIT License](LICENSE).