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
        
        // Load tech stack
        this.loadTechstack();
        
        // Load education
        this.loadEducation();
        
        // Load honors
        this.loadHonors();
        
        // Load publications
        this.loadPublications();

        // Load badges
        this.loadBadges();

        // Initialize animations
        this.initAnimations();
    }

    // Load about content from config
    async loadAboutContent() {
        const aboutContent = document.getElementById('about-content');
        
        try {
            // Use aboutMe from config
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
        const skillsGrid = document.getElementById('skills-grid');
        
        if (!skillsGrid) return;
        
        if (typeof CONFIG === 'undefined' || !CONFIG.skills) {
            return;
        }
        
        skillsGrid.innerHTML = CONFIG.skills.map(skill => `
            <div class="skill-card">
                <div class="skill-icon">${skill.icon}</div>
                <h3 class="skill-name">${skill.name}</h3>
            </div>
        `).join('');
    }

    // Load experience timeline
    loadExperience() {
        if (typeof CONFIG === 'undefined' || !CONFIG.experience) {
            return;
        }
        
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

    // Load techstack grid
    loadTechstack() {
        if (typeof CONFIG === 'undefined' || !CONFIG.techstack) return;
        
        const techstackGrid = document.getElementById('techstack-grid');
        if (!techstackGrid) return;
        
        techstackGrid.innerHTML = CONFIG.techstack.map(tech => `
            <div class="tech-item">
                <img src="${tech.logo}" alt="${tech.name}" class="tech-logo">
                <span class="tech-name">${tech.name}</span>
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

    // Load honors
    loadHonors() {
        if (typeof CONFIG === 'undefined' || !CONFIG.honors) return;
        
        const honorsGrid = document.getElementById('honors-grid');
        if (!honorsGrid) return;
        
        honorsGrid.innerHTML = CONFIG.honors.map(honor => `
            <div class="education-card">
                <h3 class="education-degree">${honor.title}</h3>
                <div class="education-school">${honor.organization}</div>
                <div class="education-year">${honor.year}</div>
                <p class="education-description">${honor.description}</p>
            </div>
        `).join('');
    }

    // Load publications
    loadPublications() {
        if (typeof CONFIG === 'undefined' || !CONFIG.publications) return;

        const publicationsGrid = document.getElementById('publications-grid');
        if (!publicationsGrid) return;

        publicationsGrid.innerHTML = CONFIG.publications.map(pub => `
            <div class="education-card">
                <h3 class="education-degree">${pub.title}</h3>
                <div class="education-school">${pub.authors}</div>
                <div class="education-year">${pub.venue} (${pub.year})</div>
                <p class="education-description">${pub.description}</p>
                ${pub.url ? `<a href="${pub.url}" class="publication-link" target="_blank" rel="noopener noreferrer">View Publication →</a>` : ''}
            </div>
        `).join('');
    }

    // Load badges
    loadBadges() {
        if (typeof CONFIG === 'undefined' || !CONFIG.badges) return;

        const badgesContainer = document.getElementById('badges-container');
        if (!badgesContainer) return;

        badgesContainer.innerHTML = CONFIG.badges.map(badge => `
            <div class="badge-card">
                <h3 class="badge-title">${badge.title}</h3>
                <div class="badge-organization">${badge.organization}</div>
                <p class="badge-description">${badge.description}</p>
                ${badge.url ? `<a href="${badge.url}" class="badge-link" target="_blank" rel="noopener noreferrer">View Profile →</a>` : ''}
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
            '.about-content, .skill-card, .timeline-item, .education-card, .tech-item, .badge-card, .cta-card'
        ).forEach((el, index) => {
            // Add staggered delay for timeline items and cards
            if (el.classList.contains('timeline-item') || el.classList.contains('education-card') || el.classList.contains('badge-card')) {
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
