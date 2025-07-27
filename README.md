# Portfolio Website

A modern, responsive portfolio website with dark/light theme toggle and optimized markdown-based blog system.

## 🚀 Features

- **Multi-page Portfolio**: Home, About, Blog, Contact pages
- **Dark/Light Theme**: Complete theme system with localStorage persistence
- **Optimized Markdown Blog**: Clean, file-based blog system with colorful tags
- **Responsive Design**: Mobile-first approach with fullscreen blog posts
- **Contact Form**: Integrated with Formspree for form handling
- **GitHub Actions**: Automated deployment workflow with modern actions
- **Privacy-First**: No external avatars or tracking

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

### Contact Page Details
```javascript
contactDetails: {
    location: "Your City, Your Country",
    availability: "Available for freelance projects",
    responseTime: "I typically respond within 24 hours"
},

faq: [
    {
        question: "What services do you offer?",
        answer: "Your detailed answer..."
    },
    // Add more FAQs...
]
```

## Notion Integration Setup

### Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "My Portfolio Blog")
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" - you'll need this

### Step 2: Create a Blog Database

1. Create a new page in Notion
2. Add a database with these exact properties:
   - **Title** (Title type) - Your blog post title
   - **Published** (Checkbox type) - Check to make post visible
   - **Date** (Date type) - Publication date
   - **Tags** (Multi-select type) - Categories/tags for your post
   - **Excerpt** (Text type) - Short description for the post card
   - **Content** (Rich text type) - Your blog post content

### Step 3: Share Database with Integration

1. Click "Share" on your database page
2. Click "Invite"
3. Find your integration name and invite it
4. Copy the database URL - you'll need the database ID from it

### Step 4: Configure API Settings

In `js/config.js`, update the Notion section:

```javascript
notion: {
    token: "secret_YOUR_INTEGRATION_TOKEN_HERE",
    databaseId: "YOUR_DATABASE_ID_HERE", // Extract from database URL
    aboutPageId: "YOUR_ABOUT_PAGE_ID_HERE" // Optional: for dynamic about content
}
```

### Finding Your Database ID

From your database URL: `https://www.notion.so/username/DATABASE_ID?v=VIEW_ID`
The DATABASE_ID is the 32-character string between the last slash and the question mark.

## Contact Form Setup

### Option 1: Formspree (Recommended)
1. Go to [formspree.io](https://formspree.io)
2. Create account and new form
3. Copy your form endpoint
4. Update config:
```javascript
settings: {
    enableContactForm: true,
    contactFormAction: "https://formspree.io/f/YOUR_FORM_ID"
}
```

### Option 2: Netlify Forms
1. Deploy to Netlify
2. Add `netlify` attribute to form in `contact.html`:
```html
<form id="contact-form" class="contact-form" netlify>
```
3. Update config:
```javascript
settings: {
    enableContactForm: true,
    contactFormAction: "/" // Netlify handles this automatically
}
```

### Option 3: Custom Backend
Set up your own form handler and update the `contactFormAction` URL.

## Creating Blog Posts

1. Add a new row to your Notion database
2. Fill in all the required fields:
   - **Title**: Your post title
   - **Published**: Check the box to make it visible
   - **Date**: When you want it to appear as published  
   - **Tags**: Add relevant tags
   - **Excerpt**: Write a compelling summary (2-3 sentences)
   - **Content**: Your full blog post content

3. Your website will automatically fetch and display published posts

## Page-Specific Features

### Home Page Features
- Shows latest 4 blog posts only
- Configurable stats/project showcase
- Compelling hero section with call-to-action buttons

### About Page Features
- Skills displayed in a grid with proficiency levels
- Timeline view of experience
- Education cards
- Call-to-action to contact page

### Blog Page Features
- Search functionality across titles, excerpts, and tags
- Tag-based filtering with dynamic tag generation
- Pagination for handling many posts
- Responsive grid that adapts to screen size

### Contact Page Features
- Working contact form with validation
- Social media integration
- Contact details section
- FAQ section for common questions
- Cross-links to other pages

## Customization Options

### Styling
- Edit `styles/main.css` to change colors, fonts, and layout
- The CSS uses modern features like CSS Grid and Flexbox
- Responsive design built-in
- Easy to customize color scheme

### Functionality  
- Each page has its own JavaScript file for specific features
- Shared functionality in `main.js`
- Modular code that's easy to extend
- Add analytics, search, or other features as needed

### Content Structure
- All content managed through the config file
- Easy to add/remove sections
- Notion integration for blog content
- Flexible and maintainable structure

## Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your site will be available at `username.github.io/repository-name`

### Netlify (Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your folder to deploy
3. Get a custom domain or use the provided netlify URL
4. Automatic HTTPS and form handling

### Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Automatic deployment on every update
4. Excellent performance and CDN

## Troubleshooting

### Common Issues

**Navigation not working:**
- Ensure all HTML files are in the root directory
- Check that file names match exactly (case-sensitive)
- Verify all JavaScript files are loading correctly

**Blog posts not loading:**
- Check your Notion integration token
- Verify database ID is correct
- Ensure database is shared with your integration
- Check browser console for error messages

**Contact form not working:**
- Verify form service is set up correctly
- Check `enableContactForm` is set to `true`
- Ensure `contactFormAction` URL is correct
- Test form validation

**Styling issues:**
- Ensure CSS file path is correct in all HTML files
- Check for typos in class names
- Verify CSS syntax is valid
- Test responsive design on different screen sizes

### Performance Tips

- The website loads Notion content dynamically
- Consider caching strategies for production use
- Optimize images in your Notion posts for web
- Test loading times and optimize as needed
- Use a CDN for better global performance

## Advanced Features

### Adding Analytics
Add Google Analytics or other tracking by including the script in your HTML head sections.

### SEO Optimization
- Update meta tags in each HTML file
- Add structured data for blog posts
- Optimize images with alt tags
- Create a sitemap.xml file

### Additional Pages
To add more pages:
1. Create new HTML file following the existing structure
2. Create corresponding JavaScript file
3. Update navigation in all HTML files
4. Add any new configuration to `config.js`

---

**Note**: This multi-page structure provides better organization and user experience compared to a single-page site. Each page serves a specific purpose and can be optimized independently.

### Basic Information
```javascript
personal: {
    name: "Your Full Name",
    title: "Your Professional Title (e.g., Full Stack Developer)",
    description: "Brief description about yourself and what you do",
    aboutMe: `
        <p>Write your personal story here...</p>
        <p>Add multiple paragraphs as needed...</p>
    `
}
```

### Contact Information
```javascript
contact: [
    {
        name: "Email",
        icon: "📧",
        url: "mailto:your.email@example.com"
    },
    {
        name: "LinkedIn",
        icon: "💼", 
        url: "https://linkedin.com/in/yourprofile"
    },
    // Add more contact methods as needed
]
```

## Notion Integration Setup

### Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "My Portfolio Blog")
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" - you'll need this

### Step 2: Create a Blog Database

1. Create a new page in Notion
2. Add a database with these exact properties:
   - **Title** (Title type) - Your blog post title
   - **Published** (Checkbox type) - Check to make post visible
   - **Date** (Date type) - Publication date
   - **Tags** (Multi-select type) - Categories/tags for your post
   - **Excerpt** (Text type) - Short description for the post card
   - **Content** (Rich text type) - Your blog post content

### Step 3: Share Database with Integration

1. Click "Share" on your database page
2. Click "Invite"
3. Find your integration name and invite it
4. Copy the database URL - you'll need the database ID from it

### Step 4: Configure API Settings

In `js/config.js`, update the Notion section:

```javascript
notion: {
    token: "secret_YOUR_INTEGRATION_TOKEN_HERE",
    databaseId: "YOUR_DATABASE_ID_HERE", // Extract from database URL
    aboutPageId: "YOUR_ABOUT_PAGE_ID_HERE" // Optional: for dynamic about content
}
```

### Finding Your Database ID

From your database URL: `https://www.notion.so/username/DATABASE_ID?v=VIEW_ID`
The DATABASE_ID is the 32-character string between the last slash and the question mark.

Example:
- URL: `https://www.notion.so/myworkspace/a1b2c3d4e5f6789012345678901234ab?v=xyz`
- Database ID: `a1b2c3d4e5f6789012345678901234ab`

## Creating Blog Posts

1. Add a new row to your Notion database
2. Fill in all the required fields:
   - **Title**: Your post title
   - **Published**: Check the box to make it visible
   - **Date**: When you want it to appear as published  
   - **Tags**: Add relevant tags
   - **Excerpt**: Write a compelling summary (2-3 sentences)
   - **Content**: Your full blog post content

3. Your website will automatically fetch and display published posts

## Customization Options

### Styling
- Edit `styles/main.css` to change colors, fonts, and layout
- The CSS uses CSS custom properties for easy theming
- All styles are organized by component for easy maintenance

### Functionality  
- Modify `js/main.js` to add new features
- The code is modular and well-commented for easy customization
- Add analytics, search, or other features as needed

### Content Structure
- Posts are automatically sorted by date (newest first)
- Tags are displayed as colored badges
- Excerpt length is flexible but keep it concise

## Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your site will be available at `username.github.io/repository-name`

### Netlify (Free)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your folder to deploy
3. Get a custom domain or use the provided netlify URL

### Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Automatic deployment on every update

## Troubleshooting

### Common Issues

**Blog posts not loading:**
- Check your Notion integration token
- Verify database ID is correct
- Ensure database is shared with your integration
- Check browser console for error messages

**Notion API errors:**
- Verify all required database properties exist and have correct names
- Make sure at least one post has "Published" checked
- Check that dates are in valid format

**Styling issues:**
- Ensure CSS file path is correct in HTML
- Check for typos in class names
- Verify CSS syntax is valid

### CORS Issues
If you encounter CORS errors when testing locally:
- Use a local server (e.g., `python -m http.server` or VS Code Live Server)
- Don't open HTML files directly in browser for testing

## Advanced Features

### Adding Search
You can extend the functionality by adding a search feature that filters posts by title, tags, or content.

### Analytics Integration
Add Google Analytics or other tracking by including the script in your HTML head section.

### Dark Mode
The CSS is structured to easily support dark mode - just add the appropriate media queries or toggle functionality.

### Comments System
Integrate services like Disqus or Giscus for blog comments.

## Security Notes

- Never expose your Notion integration token in public repositories
- Use environment variables for sensitive configuration in production
- The current setup is for client-side only - consider server-side rendering for better SEO

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Notion setup matches the requirements exactly
3. Test with a simple blog post first
4. Make sure all file paths are correct

## Updates and Maintenance

- Keep your integration token secure and rotate it periodically
- Regularly backup your Notion database
- Monitor API usage if you have high traffic
- Update dependencies if you add more features

## Performance Tips

- The website loads Notion content dynamically, so there might be a brief loading state
- Consider caching strategies for production use
- Optimize images in your Notion posts for web
- Test loading times and optimize as needed

---

**Note**: This setup provides a balance between ease of use and functionality. For more advanced features or high-traffic sites, consider implementing server-side rendering or static site generation.
