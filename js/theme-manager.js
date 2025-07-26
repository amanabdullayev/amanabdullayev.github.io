// Standalone Theme Manager
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('ThemeManager: Initializing...');
        
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        console.log('ThemeManager: Saved theme:', savedTheme);
        
        this.setTheme(savedTheme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindToggleButtons();
            });
        } else {
            this.bindToggleButtons();
        }
    }

    bindToggleButtons() {
        console.log('ThemeManager: Binding toggle buttons...');
        
        const themeToggleButtons = document.querySelectorAll('#theme-toggle, #footer-theme-toggle');
        console.log('ThemeManager: Found', themeToggleButtons.length, 'toggle buttons');
        
        themeToggleButtons.forEach((button, index) => {
            console.log(`ThemeManager: Binding button ${index}:`, button);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('ThemeManager: Toggle button clicked!');
                this.toggleTheme();
            });
        });
    }

    toggleTheme() {
        console.log('ThemeManager: Toggling theme...');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        console.log('ThemeManager: Current theme:', currentTheme);
        
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('ThemeManager: New theme:', newTheme);
        
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        console.log('ThemeManager: Setting theme to:', theme);
        
        // Set theme attribute on document
        document.documentElement.setAttribute('data-theme', theme);
        console.log('ThemeManager: Set data-theme attribute');
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        console.log('ThemeManager: Saved to localStorage');
        
        // Update theme toggle buttons
        this.updateThemeToggleButtons(theme);
        
        // Update manifest theme color
        this.updateManifestThemeColor(theme);
        
        console.log('ThemeManager: Theme set successfully');
    }

    updateThemeToggleButtons(theme) {
        const themeIcons = document.querySelectorAll('.theme-icon');
        const icon = theme === 'light' ? '☀️' : '🌙';
        
        console.log('ThemeManager: Updating', themeIcons.length, 'theme icons to:', icon);
        
        themeIcons.forEach(iconElement => {
            iconElement.textContent = icon;
        });
    }

    updateManifestThemeColor(theme) {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            const color = theme === 'light' ? '#2563eb' : '#3b82f6';
            themeColorMeta.setAttribute('content', color);
            console.log('ThemeManager: Updated manifest theme color to:', color);
        }
    }
}

// Initialize theme manager immediately
const themeManager = new ThemeManager();

// Expose for debugging
window.themeManager = themeManager;
window.testTheme = () => themeManager.toggleTheme();
