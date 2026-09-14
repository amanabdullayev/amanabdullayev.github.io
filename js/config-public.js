// Configuration file with public and private settings separated
const CONFIG = {
    // Personal Information (public)
    personal: {
        name: "Aman Abdullayev",
        title: "Applied Scientist",
        aboutMe: `
            <p><strong>I’m Aman, an applied scientist based in Berlin.</strong> My route into data science started in environmental and materials research, where I learned to work patiently with imperfect evidence and explain technical findings clearly.</p>
            <p>Today, I focus on performance marketing measurement and steering at Zalando. My work spans attribution, geo-experiments, customer value prediction, marketing mix modeling, and time-series forecasting—with an emphasis on turning analytical results into decisions people can use.</p>
        `
    },

    // Page Metadata (public)
    pages: {
        about: {
            title: "Science, context, and useful decisions",
            description: "My path from materials research to applied data science—and the problems I’m working on now."
        },
        blog: {
            title: "Notes for curious practitioners",
            description: "Applied statistics, data science, decision-making, learning, and occasional reflections on life outside the model."
        },
        contact: {
            title: "Let’s compare notes",
            description: "Have a question about marketing measurement, experimentation, or applied data work? I’d be glad to hear from you."
        },
        projects: {
            title: "Projects",
            description: "Tools and experiments I’m building to make complex learning and decision-making more useful."
        }
    },

    // Projects (public)
    projects: [
        {
            title: "Halypa",
            description: "A personal AI tutor for self-directed learners. You answer a short intake interview, get a tailored syllabus, then learn through Socratic sessions with mastery tracking, spaced review (FSRS), and a capstone project once you've covered enough ground.",
            tags: ["TypeScript", "Next.js", "Supabase", "AI", "Education"],
            url: "https://halypa.vercel.app/",
            status: "Active · 2026",
            coverImage: null,
            audience: "Self-directed learners",
            role: "Product concept, learning design, and implementation"
        }
    ],

    // Home Page Stats (public)
    homeStats: [
        {
            kicker: "Measurement",
            title: "Causal experimentation",
            description: "Designing geo-experiments and attribution approaches that separate incremental impact from correlation."
        },
        {
            kicker: "Decision systems",
            title: "Investment modeling",
            description: "Connecting elasticity, forecasts, and diminishing returns to support marketing budget decisions."
        },
        {
            kicker: "Prediction",
            title: "Long-term value",
            description: "Modeling delayed customer value so short-term signals can inform longer-term choices."
        }
    ],

    // Skills (public)
    skills: [
        {
            name: "Attribution modeling",
            description: "Estimating how channels contribute to outcomes."
        },
        {
            name: "Marketing mix modeling",
            description: "Understanding aggregate channel impact and return."
        },
        {
            name: "Geo lift testing",
            description: "Measuring incrementality through regional experiments."
        },
        {
            name: "Customer lifetime value",
            description: "Connecting early behavior with long-term outcomes."
        },
        {
            name: "Causal inference",
            description: "Distinguishing intervention effects from association."
        },
        {
            name: "Predictive modeling",
            description: "Building useful forecasts from complex signals."
        },
        {
            name: "Time-series forecasting",
            description: "Modeling change, seasonality, and uncertainty over time."
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
            logo: "../images/techstack/pymc.png"
        },
        {
            name: "Databricks",
            logo: "../images/techstack/databricks.png"
        },
        {
            name: "Snowflake",
            logo: "../images/techstack/snowflake.jpg"
        }
    ],

    // Experience (public)
    experience: [
        {
            date: "04/2026 - Present",
            title: "Data Scientist (Freelance)",
            company: "Toptal",
            description: `
            <ul>
                <li>Developed a Bayesian marketing attribution model with cold-start handling for new event organizers, supporting client budget-allocation decisions</li>
                <li>Implemented holistic customer segmentation to support targeting and personalization</li>
                <li>Built an automated marketing recommendations engine using LLMs, combining traffic data, attribution results, and customer segmentation to generate actionable recommendations for non-technical stakeholders</li>
            </ul>
            `
        },
        {
            date: "06/2025 - Present",
            title: "Applied Scientist",
            company: "Zalando",
            description: `
            <ul>
                <li>Built a causal simulation framework combining geo-experiment elasticity curves with forecasts to model diminishing returns on spend and the resulting ROI trade-off; live in 25 markets, driving 75% of marketing investment decisions</li>
                <li>Modeled long-term incremental value of short-term signals (installs, registrations), quantifying delayed marketing returns that short-term metrics miss</li>
            </ul>
            `
        },
        {
            date: "08/2023 - 05/2025",
            title: "Senior Data Scientist",
            company: "Haensel AMS GmbH",
            description: `
            <ul>
                <li>Built models for attribution, customer lifetime value, and marketing mix modeling.</li>
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

    // Honors & Awards (public)
    honors: [
        {
            title: "Research Grant for Doctoral Studies",
            organization: "DAAD (German Academic Exchange Service)",
            year: "2017 - 2021",
            description: "Ph.D. scholarship awarded by DAAD to support research in materials science focused on sustainable water filtration solutions."
        },
        {
            title: "Gold Medal",
            organization: "International Mendeleev Chemistry Olympiad (IMChO)",
            year: "2009, Ashgabat, Turkmenistan",
            description: "The International Mendeleev Chemistry Olympiad is a major international competition for high school students in theoretical and experimental chemistry. It started in the USSR as the All-Union Olympiad in Chemistry in 1967. Now more than 30 countries participate in IMChO."
        },
        {
            title: "Silver Medal",
            organization: "International Chemistry Olympiad (IChO)",
            year: "2009, Cambridge, UK",
            description: "The International Chemistry Olympiad (IChO) is a prestigious annual competition for top high school chemists from over 80 countries, featuring challenging theoretical and experimental exams to promote global scientific excellence and collaboration."
        }
        // Add more honors as needed
    ],

    // Publications (public)
    publications: [
        {
            title: "Materials and Applications for Low-Cost Ceramic Membranes",
            authors: "Abdullayev et al.",
            venue: "Membranes",
            year: "2019",
            description: "In water treatment applications, the use of ceramic membranes is associated with numerous advantages relative to polymer-based filtration ...",
            url: "https://www.mdpi.com/2077-0375/9/9/105"
        },{
            title: "Low-temperature fluoride-assisted synthesis of mullite whiskers",
            authors: "Abdullayev et al.",
            venue: "RSC Advances",
            year: "2020",
            description: "Mullite is a promising material for advanced ceramic applications. The synthesis of mullite ...",
            url: "https://pubs.rsc.org/en/content/articlehtml/2020/ra/d0ra05997h"
        },{
            title: "AlF3-assisted flux growth of mullite whiskers and their application in fabrication of porous mullite-alumina monoliths",
            authors: "Abdullayev et al.",
            venue: "Open Ceramics",
            year: "2021",
            description: "Mullite is a promising material with its competitive thermochemical and mechanical ...",
            url: "https://www.sciencedirect.com/science/article/pii/S2666539521000912" 
        },
        {
            title: "Check full publication list at Google Scholar",
            authors: "Abdullayev Profile",
            venue: "Google Scholar",
            year: "2019 - present",
            description: "Explore my complete research work, citations, and contributions in the field of materials science and environmental engineering.",
            url: "https://scholar.google.com/citations?user=22M2i14AAAAJ&hl=en&authuser=1" 
        },
        // Add more publications as needed
    ],

    // Contact Information (public)
    contact: [
        {
            name: "LinkedIn",
            url: "https://linkedin.com/in/amanmyrat-abdullayev"
        },
        {
            name: "GitHub",
            url: "https://github.com/amanabdullayev"
        },
        {
            name: "Toptal",
            url: "https://www.toptal.com/developers/resume/aman-abdullayev#KpEvbP"
        }
    ],

    // Site settings
    settings: {
        postsPerPage: 6,
        homePostsCount: 4,
        dateFormat: "MMM DD, YYYY",
        defaultTags: ["Blog", "Thoughts"],
        enableAnalytics: true,
        theme: "light"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
