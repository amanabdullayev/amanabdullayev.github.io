// Configuration loader utility
// Handles loading of environment and private configurations with proper fallbacks

class ConfigLoader {
    static async loadContactConfig() {
        try {
            // Wait for CONFIG to be available from public config
            await this.waitForConfig();
            
            // Apply environment configuration (GitHub Pages)
            if (window.ENV_CONFIG && window.ENV_CONFIG.FORMSPREE_ENDPOINT) {
                CONFIG.private = CONFIG.private || {};
                CONFIG.private.formspree = CONFIG.private.formspree || {};
                CONFIG.private.formspree.endpoint = window.ENV_CONFIG.FORMSPREE_ENDPOINT;
                CONFIG.settings.contactFormAction = window.ENV_CONFIG.FORMSPREE_ENDPOINT;
                CONFIG.settings.enableContactForm = true;
                console.log('✅ Formspree endpoint loaded from environment config');
            }
            
            // Apply private configuration (local development)
            else if (typeof PRIVATE_CONFIG !== 'undefined' && PRIVATE_CONFIG.formspree?.endpoint) {
                CONFIG.private = { ...CONFIG.private, ...PRIVATE_CONFIG };
                CONFIG.settings.contactFormAction = PRIVATE_CONFIG.formspree.endpoint;
                CONFIG.settings.enableContactForm = true;
                console.log('✅ Formspree endpoint loaded from private config');
            }
            
            // No configuration found
            else {
                console.warn('⚠️ No Formspree endpoint configured - contact form will be disabled');
                CONFIG.settings.enableContactForm = false;
                CONFIG.settings.contactFormAction = '';
            }
            
        } catch (error) {
            console.error('❌ Error loading contact configuration:', error);
            CONFIG.settings.enableContactForm = false;
        }
    }
    
    static waitForConfig(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function checkConfig() {
                if (typeof CONFIG !== 'undefined') {
                    resolve(CONFIG);
                    return;
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error('CONFIG loading timeout'));
                    return;
                }
                
                setTimeout(checkConfig, 50);
            }
            
            checkConfig();
        });
    }
}

// Auto-initialize for contact page
if (document.location.pathname.includes('contact.html') || document.location.pathname.endsWith('/contact')) {
    document.addEventListener('DOMContentLoaded', () => {
        ConfigLoader.loadContactConfig();
    });
}