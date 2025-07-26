// About page specific functionality
class AboutPage {
    constructor() {
        this.init();
    }

    async init() {
        // Load about content
        await this.loadAboutContent();
        
        // Load skills
        this.loadSkills();
        
        // Load experience timeline
        this.loadExperience();
        
        // Load education
        this.loadEducation();
        
        // Initialize animations
        this.initAnimations();
    }

    // Load about content from Notion or config
    async loadAboutContent() {
        const aboutContent = document.getElementById('about-content');
        
        try {
            // Try to load from Notion if page ID is provided
            if (notionAPI && CONFIG.notion.aboutPageId) {
                const content = await notionAPI.getPageContent(CONFIG.notion.aboutPageId);
                if (content) {
                    aboutContent.innerHTML = content;
                    return;
                }
            }
            
            // Fallback to config
            if (typeof CONFIG !== 'undefined' && CONFIG.personal.aboutMe) {
                aboutContent.innerHTML = CONFIG.personal.aboutMe;
            }
        } catch (error) {
            console.error('Error loading about content:', error);
            // Keep the fallback content
        }
    }

    // Load skills grid
    loadSkills() {
        if (typeof CONFIG === 'undefined' || !CONFIG.skills) return;
        
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;
        
        skillsGrid.innerHTML = CONFIG.skills.map(skill => `
            <div class="skill-card">
                <div class="skill-icon">${skill.icon}</div>
                <h3 class="skill-name">${skill.name}</h3>
                <p class="skill-level">${skill.level}</p>
            </div>
        `).join('');
    }

    // Load experience timeline
    loadExperience() {
        if (typeof CONFIG === 'undefined' || !CONFIG.experience) return;
        
        const timeline = document.getElementById('timeline');
        if (!timeline) return;
        
        timeline.innerHTML = CONFIG.experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-date">${exp.date}</div>
                <h3 class="timeline-title">${exp.title}</h3>
                <div class="timeline-company">${exp.company}</div>
                <p class="timeline-description">${exp.description}</p>
            </div>
        `).join('');
    }

    // Load education
    loadEducation() {
        if (typeof CONFIG === 'undefined' || !CONFIG.education) return;
        
        const educationGrid = document.getElementById('education-grid');
        if (!educationGrid) return;
        
        educationGrid.innerHTML = CONFIG.education.map(edu => `
            <div class="education-card">
                <h3 class="education-degree">${edu.degree}</h3>
                <div class="education-school">${edu.school}</div>
                <div class="education-year">${edu.year}</div>
                <p class="education-description">${edu.description}</p>
            </div>
        `).join('');
    }

    // Initialize scroll animations
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll(
            '.about-content, .skill-card, .timeline-item, .education-card, .cta-card'
        ).forEach((el, index) => {
            // Add staggered delay for timeline items
            if (el.classList.contains('timeline-item')) {
                el.style.animationDelay = `${index * 0.1}s`;
            }
            observer.observe(el);
        });
    }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
