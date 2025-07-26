// Configuration file for your portfolio/blog
const CONFIG = {
    // Personal Information
    personal: {
        name: "Your Name",
        title: "Your Professional Title",
        description: "I'm a [Your Profession] passionate about [Your Interests]. Here you'll find my thoughts, projects, and insights on [Your Topics].",
        aboutMe: `
            <p><strong>Replace this with your personal story.</strong> Write about your background, what drives you, and what makes you unique. This is your chance to connect with visitors on a personal level.</p>
            <p>Talk about your professional journey, your interests, and what you hope to achieve through your blog and work. Be authentic and let your personality shine through.</p>
            <p>You can also mention your current projects, goals, or what readers can expect to find on your site. Make it engaging and memorable.</p>
        `
    },

    // Notion API Configuration
    notion: {
        // Get your integration token from https://www.notion.so/my-integrations
        token: "YOUR_NOTION_INTEGRATION_TOKEN",
        
        // Database ID for your blog posts
        // Create a database in Notion with these properties:
        // - Title (Title)
        // - Published (Checkbox)
        // - Date (Date)
        // - Tags (Multi-select)
        // - Excerpt (Text)
        // - Content (Rich text)
        databaseId: "YOUR_NOTION_DATABASE_ID",
        
        // Page ID for your About page (optional)
        aboutPageId: "YOUR_NOTION_ABOUT_PAGE_ID"
    },

    // Contact Information
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
        {
            name: "Twitter",
            icon: "🐦",
            url: "https://twitter.com/yourhandle"
        },
        {
            name: "GitHub",
            icon: "🔗",
            url: "https://github.com/yourusername"
        }
    ],

    // Site Settings
    settings: {
        postsPerPage: 10,
        dateFormat: "MMM DD, YYYY",
        defaultTags: ["Blog", "Thoughts"],
        enableAnalytics: false, // Set to true when you add analytics
        theme: "light" // Options: light, dark, auto
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
