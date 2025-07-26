// Configuration file for your portfolio/blog
const CONFIG = {
    // Personal Information
    personal: {
        name: "Aman Abdullayev",
        title: "Applied Scientist",
        // description: "I'm an Applied Scientist passionate about marketing analytics, machine learning, and mentoring young minds. Here you'll find my thoughts, projects, and insights on data science and personal growth.",
        homeIntro: `
            <p><strong>Welcome to my digital space!</strong> I'm an Applied Scientist passionate about turning data into actionable insights and building meaningful connections through technology.</p>
            <p>Here you'll discover my journey at the intersection of machine learning and marketing analytics, along with thoughts on mentoring, personal growth, and the evolving world of data science.</p>
            <p>Feel free to explore my latest projects, read my blog posts, and connect with me if you'd like to collaborate or just have a chat about data, technology, or life in general.</p>
        `,
        aboutMe: `
            <p><strong>I'm Aman, a data scientist and researcher based in Berlin.</strong> With a background spanning environmental science and machine learning, I love turning complex data into actionable insights—especially in the marketing world.</p>
            <p>I currently work as an Applied Scientist at Zalando, focusing on performance marketing measurement and steering. My past roles include building attribution models, geo-experiments, and customer value predictions.</p>
        `
    },

    // Page Metadata
    pages: {
        about: {
            title: "About Me",
            description: "Skills, experience, and my journey in data science"
        },
        blog: {
            title: "Blog",
            description: "Thoughts, insights, and stories from my journey"
        },
        contact: {
            title: "Get In Touch",
            description: "Let's connect! Whether you have a question, want to collaborate, or just say hi, I'm here to chat."
        }
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
            name: "Python"
        },
        {
            icon: "🧩📊🧭",
            name: "Attribution Modeling"
        },
        {
            icon: "🧾⚖️🎯",
            name: "MMM (Mixed Media Modeling)"
        },
        {
            icon: "🌍🧪📊",
            name: "(Geo) Lift Testing"
        },
        {
            icon: "🧍‍♂️🔁💰",
            name: "Customer Lifetime Value"
        },
        {
            icon: "⚗️🔗📈",
            name: "Causal Inference"
        },
        {
            icon: "🧠🤖💡",
            name: "Predictive Modeling"
        },
        {
            icon: "🕒📈🔮",
            name: "Time Series Forecasting"
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
    education: [
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
            url: "https://linkedin.com/in/amanmyrat-abdullayev"
        },
        {
            name: "GitHub",
            icon: "🐙",
            url: "https://github.com/amanabdullayev"
        }
    ],

    // Notion API Configuration
    notion: {
        token: "secret_h18M3wQutOZDi5INlEu8ACm9jZVlrKwNF3sg35zXyUp",
        databaseId: "3a86829dbab84364bafd46390180b730",
        aboutPageId: "About-Me-d9bc4468ddb24c198df8c636ae5e22a0"
    },

    // Site Settings
    settings: {
        postsPerPage: 6,
        homePostsCount: 4,
        dateFormat: "MMM DD, YYYY",
        defaultTags: ["Blog", "Thoughts"],
        enableAnalytics: false,
        theme: "light",
        enableContactForm: true,
        contactFormAction: "https://formspree.io/f/xovldbzk"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
