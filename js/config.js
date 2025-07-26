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
        icon: "🐍",
        name: "Python",
        level: "Advanced"
    },
    {
        icon: "🧠",
        name: "Machine Learning",
        level: "Advanced"
    },
    {
        icon: "📈",
        name: "Marketing Analytics",
        level: "Advanced"
    },
    {
        icon: "📊",
        name: "Data Analysis",
        level: "Advanced"
    }
],

    // Experience Timeline for About Page
    experience: [
        {
    date: "06/2025 - Present",
    title: "Applied Scientist",
    company: "Zalando",
    description: `
        <p>Work in the Performance Marketing department.</p>
        <p>Focus on measurement and steering topics.</p>
    `
},
{
    date: "08/2023 - 05/2025",
    title: "Senior Data Scientist",
    company: "Haensel AMS GmbH",
    description: `
        <p>Built models for attribution, customer lifetime value, and mixed media modeling.</p>
        <p>Designed geo-experiments to test uplift and incrementality.</p>
        <p>Communicated findings and insights with stakeholders.</p>
    `
},
{
    date: "12/2021 - 07/2023",
    title: "Data Science Support Engineer",
    company: "One Data GmbH",
    description: `
        <p>Maintained analytics projects for supply chain and purchasing teams.</p>
        <p>Built dashboards and web apps on the One Data Platform.</p>
        <p>Automated pipeline monitoring with APIs and Slack notifications.</p>
    `
},
{
    date: "08/2014 - 07/2017",
    title: "Research Assistant",
    company: "Centre of Technologies",
    description: `
        <p>Managed equipment and logistics for the environmental lab.</p>
        <p>Prepared interim reports on lab research projects.</p>
    `
}

    ],

    // Education for About Page
    eeducation: [
    {
        degree: "Ph.D. in Materials Science",
        school: "TU Berlin, Germany",
        year: "2017 - 2021",
        description: "Researched low-cost materials for water filtration. Work includes synthesis, processing, and material characterization. Pending patent on fungal-based materials."
    },
    {
        degree: "Data Scientist Certification",
        school: "Practicum by Yandex",
        year: "2021",
        description: "Intensive bootcamp covering math, statistics, EDA, SQL, ML models, time series, computer vision, and NLP."
    },
    {
        degree: "Diploma in Environmental Science",
        school: "Turkmen State University, Turkmenistan",
        year: "2009 - 2014",
        description: "Studied environmental systems, sustainability, and ecological research methods."
    }
]
,

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
            icon: "🐙",
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
