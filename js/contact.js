// Contact page specific functionality
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        // Load contact information
        this.loadContactInfo();
        
        // Load contact details
        this.loadContactDetails();
        
        // Load FAQ
        this.loadFAQ();
        
        // Initialize contact form
        this.initContactForm();
        
        // Initialize animations
        this.initAnimations();
    }

    // Load contact links
    loadContactInfo() {
        if (typeof CONFIG === 'undefined') return;
        
        const contactLinksContainer = document.getElementById('contact-links');
        if (!contactLinksContainer) return;
        
        contactLinksContainer.innerHTML = '';
        
        CONFIG.contact.forEach(contact => {
            const link = document.createElement('a');
            link.href = contact.url;
            link.className = 'contact-link';
            link.target = contact.url.startsWith('mailto:') ? '_self' : '_blank';
            link.innerHTML = `
                <span>${contact.icon}</span>
                <span>${contact.name}</span>
            `;
            contactLinksContainer.appendChild(link);
        });
    }

    // Load contact details
    loadContactDetails() {
        if (typeof CONFIG === 'undefined' || !CONFIG.contactDetails) return;
        
        const { contactDetails } = CONFIG;
        
        // Location
        const locationText = document.getElementById('location-text');
        if (locationText && contactDetails.location) {
            locationText.textContent = contactDetails.location;
        }
        
        // Availability
        const availabilityText = document.getElementById('availability-text');
        if (availabilityText && contactDetails.availability) {
            availabilityText.textContent = contactDetails.availability;
        }
        
        // Response time
        const responseText = document.getElementById('response-text');
        if (responseText && contactDetails.responseTime) {
            responseText.textContent = contactDetails.responseTime;
        }
    }

    // Load FAQ section
    loadFAQ() {
        if (typeof CONFIG === 'undefined' || !CONFIG.faq) return;
        
        const faqList = document.getElementById('faq-list');
        if (!faqList) return;
        
        faqList.innerHTML = CONFIG.faq.map(item => `
            <div class="faq-item">
                <div class="faq-question">${item.question}</div>
                <div class="faq-answer">${item.answer}</div>
            </div>
        `).join('');
    }

    // Initialize contact form
    initContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };
                
                // If contact form is disabled in config, show message
                if (!CONFIG.settings.enableContactForm) {
                    this.showFormStatus('Contact form is currently disabled. Please use the contact links above.', 'error');
                    return;
                }
                
                // Check if form action is configured
                if (!CONFIG.settings.contactFormAction || CONFIG.settings.contactFormAction.includes('YOUR_FORM_ID')) {
                    this.showFormStatus('Contact form is not configured. Please set up a form service in the config.', 'error');
                    return;
                }
                
                // Submit to form service (e.g., Formspree, Netlify Forms, etc.)
                const response = await fetch(CONFIG.settings.contactFormAction, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    this.showFormStatus('Thank you for your message! I\'ll get back to you soon.', 'success');
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormStatus('Sorry, there was an error sending your message. Please try again or use the contact links above.', 'error');
            } finally {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Form validation
        this.initFormValidation(form);
    }

    // Initialize form validation
    initFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Remove error styling when user starts typing
                input.classList.remove('error');
            });
        });
    }

    // Validate individual form field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Add error styling
        if (!isValid) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
        
        return isValid;
    }

    // Show form status message
    showFormStatus(message, type) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Initialize animations
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
            '.contact-form, .contact-methods, .contact-detail, .faq-section, .cta-card'
        ).forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});
