// Configuration file for your portfolio/blog
const CONFIG = {
    // Personal Information
    personal: {
        name: "Aman Myrat Abdullayev",
        title: "Applied Scientist",
        description: "I'm a [Your Profession] passionate about [Your Interests]. Here you'll find my thoughts, projects, and insights on [Your Topics].",
        intro: "Brief introduction about what you do and your expertise. This appears on the home page to give visitors a quick overview of your work and interests.",
        aboutMe: `
            <p><strong>Replace this with your personal story.</strong> Write about your background, what drives you, and what makes you unique. This is your chance to connect with visitors on a personal level.</p>
            <p>Talk about your professional journey, your interests, and what you hope to achieve through your blog and work. Be authentic and let your personality shine through.</p>
            <p>You can also mention your current projects, goals, or what readers can expect to find on your site. Make it engaging and memorable.</p>
        `
    },

    // Home Page Stats/What I'm Working On
    homeStats: [
        {
            icon: "💻",
            title: "Active Projects",
            description: "Currently working on 3 exciting projects"
        },
        {
            icon: "📝",
            title: "Blog Posts",
            description: "Sharing insights and experiences regularly"
        },
        {
            icon: "🚀",
            title: "Learning",
            description: "Always expanding my skillset and knowledge"
        }
    ],

    // Skills for About Page
    skills: [
        {
            icon: "⚛️",
            name: "React/Next.js",
            level: "Advanced"
        },
        {
            icon: "🐍",
            name: "Python",
            level: "Advanced"
        },
        {
            icon: "☁️",
            name: "Cloud Services",
            level: "Intermediate"
        },
        {
            icon: "🎨",
            name: "UI/UX Design",
            level: "Intermediate"
        },
        {
            icon: "📊",
            name: "Data Analysis",
            level: "Advanced"
        },
        {
            icon: "🔧",
            name: "DevOps",
            level: "Intermediate"
        }
    ],

    // Experience Timeline for About Page
    experience: [
        {
    date: "06/2025 - Present",
    title: "Applied Scientist",
    company: "Zalando",
    description: [
        "Work in Performance Marketing department",
        "Focus on measurement and steering topics"
    ]
},
{
    date: "08/2023 - 05/2025",
    title: "Senior Data Scientist",
    company: "Haensel AMS GmbH",
    description: [
        "Built models: Attribution, CLV, MMM",
        "Designed geo-experiments to test incrementality",
        "Presented insights to stakeholders"
    ]
},
{
    date: "12/2021 - 07/2023",
    title: "Data Science Support Engineer",
    company: "One Data GmbH",
    description: [
        "Maintained analytics projects for supply chain",
        "Built dashboards and apps on One Data Platform",
        "Automated monitoring via APIs and Slack"
    ]
},
{
    date: "08/2014 - 07/2017",
    title: "Research Assistant",
    company: "Centre of Technologies",
    description: [
        "Managed environmental lab equipment",
        "Prepared reports on lab projects"
    ]
}

    ],

    // Education for About Page
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            school: "University Name",
            year: "2015 - 2019",
            description: "Focused on software engineering, algorithms, and data structures. Graduated with honors."
        },
        {
            degree: "Certification in Web Development",
            school: "Coding Bootcamp",
            year: "2019",
            description: "Intensive program covering modern web development technologies and best practices."
        }
    ],

    // Contact Information
    contact: [
        {
            name: "Email",
            icon: "📧",
            url: "mailto:amanmyrat.abdullayev@gmail.com"
        },
        {
            name: "LinkedIn",
            icon: "💼",
            url: "linkedin.com/in/amanmyrat-abdullayev"
        },
        // {
        //     name: "Twitter",
        //     icon: "🐦",
        //     url: "https://twitter.com/yourhandle"
        // },
        {
            name: "GitHub",
            icon: "🔗",
            url: "https://github.com/amanabdullayev"
        }
    ],

    // Contact Page Details
    contactDetails: {
        location: "Berlin, Germany",
        availability: "Available for freelance projects and collaborations",
        responseTime: "I typically respond within 24 hours"
    },

    // FAQ for Contact Page
    faq: [
        {
            question: "What services do you offer?",
            answer: "I specialize in web development, focusing on React/Next.js frontend development and Python backend services."
        },
        {
            question: "What's your typical project timeline?",
            answer: "Project timelines vary depending on scope, but most projects range from 2-8 weeks from start to completion."
        },
        {
            question: "Do you work with international clients?",
            answer: "Yes, I work with clients worldwide and am comfortable with remote collaboration across different time zones."
        },
        {
            question: "What's your preferred way of communication?",
            answer: "I prefer email for initial contact, then we can move to video calls or other platforms as needed for the project."
        }
    ],

    // Notion API Configuration
    notion: {
        // Get your integration token from https://www.notion.so/my-integrations
        token: "secret_h18M3wQutOZDi5INlEu8ACm9jZVlrKwNF3sg35zXyUp",
        
        // Database ID for your blog posts
        // Create a database in Notion with these properties:
        // - Title (Title)
        // - Published (Checkbox)
        // - Date (Date)
        // - Tags (Multi-select)
        // - Excerpt (Text)
        // - Content (Rich text)
        databaseId: "Aman-s-Blog-52279fabee264ed7b5fa1681f9c7a1a9",
        
        // Page ID for your About page (optional)
        aboutPageId: "About-Me-d9bc4468ddb24c198df8c636ae5e22a0"
    },

    // Site Settings
    settings: {
        postsPerPage: 6,
        homePostsCount: 4, // Number of posts to show on home page
        dateFormat: "MMM DD, YYYY",
        defaultTags: ["Blog", "Thoughts"],
        enableAnalytics: false, // Set to true when you add analytics
        theme: "light", // Options: light, dark, auto
        enableContactForm: true, // Set to false to hide contact form
        contactFormAction: "https://formspree.io/f/YOUR_FORM_ID" // Replace with your form service
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
