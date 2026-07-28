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

        const previewHtml = project.url
            ? `<div class="project-preview">
                <iframe
                    src="${project.url}"
                    title="${project.title} preview"
                    loading="lazy"
                    scrolling="no"
                    tabindex="-1">
                </iframe>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-preview-overlay" aria-label="Open ${project.title}"></a>
               </div>`
            : '';

        return `
            <article class="project-card">
                ${previewHtml}
                <div class="post-content">
                    <h3 class="post-title">${project.title}</h3>
                    <div class="post-tags">${tagsHtml}</div>
                    <p class="post-excerpt">${project.description}</p>
                    <div class="post-meta">
                        <span class="post-date">${project.status || ''}</span>
                        ${project.url
                            ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">View →</a>`
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
