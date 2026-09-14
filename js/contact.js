class ContactPage {
    constructor() {
        this.loadContactInfo();
    }

    loadContactInfo() {
        const contactLinksContainer = document.getElementById('contact-links');

        if (!contactLinksContainer || typeof CONFIG === 'undefined') return;

        contactLinksContainer.innerHTML = CONFIG.contact.map(contact => `
            <a href="${contact.url}" class="contact-link" target="_blank" rel="noopener noreferrer">
                <span>${contact.name}</span>
                <span class="contact-link-arrow" aria-hidden="true">↗</span>
            </a>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});
