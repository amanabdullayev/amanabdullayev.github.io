class ProjectsPage {
    constructor() {
        this.init();
    }

    init() {
        this.loadProjects();
    }

    loadProjects() {
        const loadingEl = document.getElementById('loading-projects');
        const gridEl = document.getElementById('projects-grid');
        const emptyEl = document.getElementById('no-projects');

        if (!gridEl) return;

        if (typeof CONFIG === 'undefined' || !CONFIG.projects || CONFIG.projects.length === 0) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (loadingEl) loadingEl.style.display = 'none';
        gridEl.style.display = 'grid';
        gridEl.innerHTML = CONFIG.projects.map(project => this.createProjectCard(project)).join('');

        // Staggered fade-in
        gridEl.querySelectorAll('.post-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('fade-in'), i * 100);
        });
    }

    createProjectCard(project) {
        const tagsHtml = (project.tags || []).map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
        }).join('');

        const coverHtml = project.coverImage
            ? `<div class="post-cover">
                <img src="../${project.coverImage}" alt="${project.title}" class="post-cover-image" loading="lazy">
               </div>`
            : '';

        const linkAttrs = project.url
            ? `href="${project.url}" target="_blank" rel="noopener noreferrer"`
            : `href="#"`;

        return `
            <article class="post-card">
                <a ${linkAttrs} style="text-decoration: none; color: inherit; display: block;">
                    ${coverHtml}
                    <div class="post-content">
                        <h3 class="post-title">${project.title}</h3>
                        <div class="post-tags">${tagsHtml}</div>
                        <p class="post-excerpt">${project.description}</p>
                        <div class="post-meta">
                            <span class="post-date">${project.status || ''}</span>
                            ${project.url ? `<span class="btn btn-primary" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">View →</span>` : ''}
                        </div>
                    </div>
                </a>
            </article>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('/projects')) {
        new ProjectsPage();
    }
});
