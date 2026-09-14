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

        gridEl.querySelectorAll('.project-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('fade-in'), i * 100);
        });
    }

    createProjectCard(project) {
        const tagsHtml = (project.tags || []).map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
        }).join('');

        return `
            <article class="project-card">
                <div class="post-content">
                    <p class="project-kicker">${project.audience || 'Selected project'} · ${project.status || 'In progress'}</p>
                    <h3 class="post-title">${project.title}</h3>
                    <p class="post-excerpt">${project.description}</p>
                    ${project.role ? `<p class="project-role"><strong>My role:</strong> ${project.role}</p>` : ''}
                    <div class="post-tags">${tagsHtml}</div>
                    <div class="post-meta">
                        <span class="post-date">External project</span>
                        ${project.url
                            ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit project</a>`
                            : ''}
                    </div>
                </div>
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
