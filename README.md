# Portfolio Website

A modern, responsive portfolio website with dark/light theme toggle and optimized markdown-based blog system.

## 🚀 Features

- **Multi-page Portfolio**: Home, About, Blog, Contact pages with clean URLs
- **Clean URL Structure**: SEO-friendly URLs without .html extensions
- **Dark/Light Theme**: Complete theme system with localStorage persistence
- **Hybrid Blog System**: Static page generation + client-side interactivity for optimal performance
- **Responsive Design**: Mobile-first approach with fullscreen blog posts
- **Contact Form**: Integrated with Formspree for form handling
- **GitHub Actions**: Automated deployment workflow with modern actions
- **Performance Optimized**: Static pages with reduced client-side JavaScript (~70% reduction)

## 📁 File Structure

```
portfolio/
├── index.html              # Home page (accessible at /)
├── about/
│   └── index.html         # About page (accessible at /about)
├── blog/
│   └── index.html         # Blog listing page (accessible at /blog)
├── contact/
│   └── index.html         # Contact page (accessible at /contact)
├── 404.html               # 404 handling with clean URL routing
├── styles/
│   └── main.css           # Unified styles with theme variables & tag colors
├── js/
│   ├── config-public.js   # Public configuration
│   ├── config-private.js  # Private configuration (gitignored)
│   ├── main.js            # Shared functionality & theme system
│   ├── home.js            # Home page functionality
│   ├── about.js           # About page functionality
│   ├── blog.js            # Blog listing with tag filtering
│   ├── blog-post.js       # Blog post sharing & code highlighting
│   ├── contact.js         # Contact form functionality
│   ├── blog-posts-index.json # Generated blog index
│   └── blog-index.js      # Blog listing & tag management
├── blog-posts/
│   ├── *.md               # Blog post markdown files
│   └── blog_images/       # Blog post images
├── blog/                  # Blog and generated static blog post pages
│   ├── index.html         # Blog listing page
│   └── [slug]/           # Individual post directories
│       └── index.html    # Static post pages (accessible at /blog/[slug])
└── .github/
    ├── workflows/
    │   └── deploy.yml     # GitHub Actions deployment
    └── scripts/
        ├── generate-blog.js       # Blog generation script
        ├── generate-blog-index.js # Blog index generation
        └── generate-blog-pages.js # Static page generation
```

## 🌐 URL Structure

The site uses clean URLs for better SEO and user experience:

- **Home**: `https://amanabdullayev.me/`
- **About**: `https://amanabdullayev.me/about`
- **Blog**: `https://amanabdullayev.me/blog`
- **Contact**: `https://amanabdullayev.me/contact`
- **Blog Posts**: `https://amanabdullayev.me/blog/[slug]`

## 🎨 Theme System

The website features a complete dark/light theme system:

- **CSS Variables**: All colors defined as CSS custom properties
- **Theme Toggle**: Sun/moon icon toggle in navigation
- **Persistence**: Theme choice saved to localStorage
- **Smooth Transitions**: Animated theme switching

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

### Creating Blog Posts

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

## 🔧 Configuration

### Public Configuration (`js/config-public.js`)
Contains non-sensitive data like:
- Personal information
- Skills and experience
- Social links
- Public settings

### Private Configuration (`js/config-private.js`)
Contains sensitive data (gitignored):
- API endpoints
- Form handlers
- Private tokens

## 🚀 Deployment

### GitHub Pages with Actions

The repository includes a GitHub Actions workflow that:
1. Processes markdown files and generates static blog pages
2. Creates blog index for client-side functionality
3. Builds the blog index from markdown files
4. Processes configuration with environment variables
5. Deploys to GitHub Pages

### Environment Variables

Set these in your GitHub repository secrets:
- `FORMSPREE_ENDPOINT`: Your Formspree form endpoint
- Add any other sensitive configuration values

## ⚡ Performance

### Optimized Architecture

The blog system is designed for optimal performance:

- **Static Generation**: Blog posts are pre-rendered as static HTML during build time
- **Reduced JavaScript**: ~70% reduction in client-side JavaScript compared to previous dynamic approach
- **Fast Loading**: Static pages load instantly without markdown processing overhead
- **SEO Optimized**: Pre-rendered content is immediately available to search engines
- **Efficient Caching**: Static files can be cached effectively by CDNs and browsers

### Build vs Runtime

- **Build Time**: Heavy markdown processing, table rendering, and page generation
- **Runtime**: Lightweight blog listing, search, filtering, and user interactions
- **Best of Both**: Static performance with dynamic user experience

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Touch-friendly**: Proper touch targets and spacing
- **Performance**: Optimized loading and rendering

## 🛠️ Development

### Local Development

1. Clone the repository
2. Create `js/config-private.js` with your configuration
3. Open `index.html` in a browser or use a local server

### Adding New Pages

1. Create HTML file with proper structure
2. Link relevant JavaScript files
3. Update navigation in all pages
4. Add corresponding CSS if needed

## 🔒 Security

- **Private Config**: Sensitive data kept in gitignored files
- **Environment Variables**: Production secrets managed via GitHub
- **No API Keys**: Client-side code contains no sensitive tokens

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

1. **Download all files** and organize them in the structure shown above
2. **Configure your personal information** in `js/config.js`
3. **Set up Notion integration** (optional but recommended)
4. **Deploy your website** to any web hosting service

## Page Overview

### 🏠 Home Page (`index.html`)
- Hero section with your introduction
- Brief "What I Do" section
- Latest 4 blog posts
- "What I'm Working On" stats section

### 👤 About Page (`about.html`)
- Detailed about content (from Notion or config)
- Skills grid with icons and proficiency levels
- Experience timeline
- Education section
- Call-to-action to contact

### 📝 Blog Page (`blog.html`)
- All blog posts with search functionality
- Tag-based filtering
- Pagination for large numbers of posts
- Responsive grid layout

### 📧 Contact Page (`contact.html`)
- Contact form (integrates with form services)
- Social media links
- Contact details (location, availability, response time)
- FAQ section
- Links back to other pages

## Personal Configuration

Edit `js/config.js` to customize your website:

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

## Improvement Ideas
- Cover images for each blog post
- Ensure full excerpt is shown as preview of a blog
- GA4 integration
- Social link sharing preview images
- ~~SEO optimization~~ ✅ **COMPLETED** - Added Open Graph and Twitter Card meta tags
- Blog view counter (compatible with Counter.dev analytics)
- Commenting system for blog posts
