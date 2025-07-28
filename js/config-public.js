// Configuration file with public and private settings separated
const CONFIG = {
    // Personal Information (public)
    personal: {
        name: "Aman Abdullayev",
        title: "Applied Scientist",
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

    // Page Metadata (public)
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

    // Home Page Stats (public)
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

    // Skills (public)
    skills: [
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

    // Techstack (public)
    techstack: [
        {
            name: "Python",
            logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
        },
        {
            name: "SQL",
            logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
        },
        {
            name: "Pandas",
            logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
        },
        {
            name: "Numpy",
            logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
        },
        {
            name: "Scipy",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/SCIPY_2.svg"
        },
        {
            name: "ScikitLearn",
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"
        },
        {
            name: "Matplotlib",
            logo: "https://matplotlib.org/stable/_images/sphx_glr_logos2_003.png"
        },
        {
            name: "PyMC",
            logo: "images/techstack/pymc.png"
        },
        {
            name: "Databricks",
            logo: "images/techstack/databricks.png"
        },
        {
            name: "Snowflake",
            logo: "images/techstack/snowflake.jpg"
        }
    ],

    // Experience (public)
    experience: [
        {
            date: "06/2025 - Present",
            title: "Applied Scientist",
            company: "Zalando",
            description: `
            <ul>
                <li>Work in the Performance Marketing department.</li>
                <li>Focus on measurement and steering topics.</li>
            </ul>
            `
        },
        {
            date: "08/2023 - 05/2025",
            title: "Senior Data Scientist",
            company: "Haensel AMS GmbH",
            description: `
            <ul>
                <li>Built models for attribution, customer lifetime value, and mixed media modeling.</li>
                <li>Designed geo-experiments to test uplift and incrementality.</li>
                <li>Communicated findings and insights with stakeholders.</li>
            </ul>
            `
        },
        {
            date: "12/2021 - 07/2023",
            title: "Data Science Support Engineer",
            company: "One Data GmbH",
            description: `
            <ul>
                <li>Supported data science teams in building and deploying models.</li>
                <li>Maintained analytics projects for supply chain and purchasing teams.</li>
                <li>Built dashboards and web apps on the One Data Platform.</li>
                <li>Automated pipeline monitoring with APIs and Slack notifications.</li>
            </ul>
            `
        },
        {
            date: "08/2014 - 07/2017",
            title: "Research Assistant",
            company: "Centre of Technologies",
            description: `
            <ul>
                <li>Managed equipment and logistics for the environmental lab.</li>
                <li>Prepared interim reports on lab research projects.</li>
            </ul>
            `
        }
    ],

    // Education (public)
    education: [
        {
            degree: "Ph.D. in Materials Science",
            school: "TU Berlin, Germany",
            year: "2017 - 2021",
            description: "Research: Low-cost ceramic materials for water filtration membranes. Work includes synthesis, processing, and material characterization. <strong>Pending patent on fungal-based materials.</strong>"
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

    // Contact Information (public)
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

    // GitHub Repository Info (public)
    github: {
        username: "amanabdullayev",
        repository: "amanabdullayev.github.io"
    },

    // Private configuration loaded from environment or separate file
    private: {
        // These will be loaded from environment variables or a separate config
        formspree: {
            endpoint: "" // Will be set from private config
        },
        github: {
            token: "" // Optional for higher API limits
        }
    },

    // Site Settings (mostly public)
    settings: {
        postsPerPage: 6,
        homePostsCount: 4,
        dateFormat: "MMM DD, YYYY",
        defaultTags: ["Blog", "Thoughts"],
        enableAnalytics: true,
        theme: "light",
        enableContactForm: true,
        // This will be set from private config
        contactFormAction: "" // Will be populated from private.formspree.endpoint
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
