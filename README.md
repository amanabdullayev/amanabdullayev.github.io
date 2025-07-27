# Portfolio Website

A modern, responsive portfolio website with dark/light theme toggle and optimized markdown-based blog system.

## 🚀 Features

- **Multi-page Portfolio**: Home, About, Blog, Contact pages
- **Dark/Light Theme**: Complete theme system with localStorage persistence
- **Optimized Markdown Blog**: Clean, file-based blog system with colorful tags
- **Responsive Design**: Mobile-first approach with fullscreen blog posts
- **Contact Form**: Integrated with Formspree for form handling
- **GitHub Actions**: Automated deployment workflow with modern actions

## 📁 File Structure

```
portfolio/
├── index.html              # Home page
├── about.html              # About page  
├── blog.html               # Blog listing page
├── blog-post.html          # Individual blog post template
├── contact.html            # Contact page
├── styles/
│   └── main.css           # Unified styles with theme variables & tag colors
├── js/
│   ├── config-public.js   # Public configuration
│   ├── config-private.js  # Private configuration (gitignored)
│   ├── main.js            # Shared functionality & theme system
│   ├── home.js            # Home page functionality
│   ├── about.js           # About page functionality
│   ├── blog.js            # Blog listing with tag filtering
│   ├── blog-post.js       # Individual blog post functionality
│   ├── contact.js         # Contact form functionality
│   ├── blog-posts-index.json # Generated blog index
│   └── markdown-blog-cms.js # Optimized markdown processing
├── blog-posts/
│   ├── *.md               # Blog post markdown files
└── .github/
    ├── workflows/
    │   └── deploy.yml     # GitHub Actions deployment
    └── scripts/
        ├── generate-blog.js     # Blog generation script
        └── generate-blog-index.js # Blog index generation
```

## 🎨 Theme System

The website features a complete dark/light theme system:

- **CSS Variables**: All colors defined as CSS custom properties
- **Theme Toggle**: Sun/moon icon toggle in navigation
- **Persistence**: Theme choice saved to localStorage
- **Smooth Transitions**: Animated theme switching

## ✍️ Blog System

### Creating Blog Posts

1. Create a new `.md` file in the `blog-posts/` directory
2. Add metadata at the top of your markdown file:

```markdown
**Published:** July 15, 2025
**Tags:** data-science, analytics, marketing
**Excerpt:** Brief description of your post that will appear in listings...

# Your Blog Post Title

Your blog content here using standard markdown...
```

3. The build process automatically generates the blog index
4. Individual post pages are created dynamically

### Blog Features

- **Optimized Markdown Processing**: Fast markdown-to-HTML conversion
- **Colorful Tag System**: 10 distinct color schemes for tags with light/dark theme support
- **Fullscreen Reading**: Wide containers (900px-1000px) for better reading experience
- **Excerpt Prioritization**: Uses explicit excerpts from metadata over auto-generated content
- **Privacy-First**: No external avatars or tracking pixels
- **Mobile Optimized**: Responsive design with smooth scrolling

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
1. Builds the blog index from markdown files
2. Processes configuration with environment variables
3. Deploys to GitHub Pages

### Environment Variables

Set these in your GitHub repository secrets:
- `FORMSPREE_ENDPOINT`: Your Formspree form endpoint
- Add any other sensitive configuration values

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

## Imprevement Ideas
- GA4
- Social link sharing preview images
- SEO optimization
- Blog View counter
- Commenting Option for Blogs
