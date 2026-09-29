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

        gridEl.querySelectorAll('.project-preview iframe').forEach(frame => {
            frame.addEventListener('load', () => frame.closest('.project-preview').classList.add('is-live'));
        });
    }

    createProjectCard(project) {
        const tagsHtml = (project.tags || []).map(tag => {
            const colorIndex = getTagColorIndex(tag);
            return `<span class="tag" data-color="${colorIndex}">${tag}</span>`;
        }).join('');

        const preview = project.preview;
        const showLivePreview = project.previewUrl && window.location.hostname === 'amanabdullayev.me';

        return `
            <article class="project-card">
                ${preview ? `
                    <div class="project-preview">
                        <div class="project-preview-fallback" aria-hidden="true">
                            <div class="project-preview-header">
                                <span class="project-preview-mark">H</span>
                                <span class="project-preview-brand">HALYPA</span>
                                <span class="project-preview-signin">Sign in →</span>
                            </div>
                            <span class="project-preview-eyebrow">${preview.eyebrow}</span>
                            <p class="project-preview-headline">${preview.headline}</p>
                            <p class="project-preview-description">${preview.description}</p>
                            <span class="project-preview-button">Get started</span>
                            <div class="project-preview-session">
                                <span>Today's session</span>
                                <strong>${preview.session}</strong>
                            </div>
                        </div>
                        ${showLivePreview ? `<iframe src="${project.previewUrl}"
                                title="${project.title} website preview"
                                loading="lazy"
                                tabindex="-1"
                                aria-hidden="true"></iframe>` : ''}
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer"
                           class="project-preview-link" aria-label="Open ${project.title} in a new tab"></a>
                    </div>
                ` : ''}
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
