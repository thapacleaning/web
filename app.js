// app.js
// Main application logic for Brisbane North Bond & Carpet Cleaners website

// Application Configuration
const AppConfig = {
    company: {
        name: "Brisbane North Bond & Carpet Cleaners",
        phone: "0460 958 603",
        email: "info@bnbcc.com.au",
        address: "Servicing Brisbane North Side",
        hours: "Mon-Fri 7AM-7PM, Sat 8AM-5PM",
        abn: "123 456 789"
    },
    contactInfo: [
        { icon: "📞", title: "Phone", content: "0460 958 603" },
        { icon: "📧", title: "Email", content: "info@bnbcc.com.au" },
        { icon: "📍", title: "Location", content: "Servicing Brisbane North Side" },
        { icon: "🕒", title: "Business Hours", content: "Mon-Fri 7AM-7PM, Sat 8AM-5PM" },
        { icon: "⚡", title: "Response Time", content: "Within 24 hours" }
    ],
    whyUsData: [
        { 
            icon: "⭐", 
            title: "10+ Years Experience", 
            description: "Over a decade of professional cleaning expertise serving Brisbane's North Side communities." 
        },
        { 
            icon: "🏢", 
            title: "Real Estate Trusted", 
            description: "Preferred cleaning partner for leading real estate agencies across Brisbane North." 
        },
        { 
            icon: "⚡", 
            title: "Same Day Service", 
            description: "Fast response times with same-day service available for urgent cleaning needs." 
        },
        { 
            icon: "✔️", 
            title: "Satisfaction Guaranteed", 
            description: "Our work comes with a satisfaction guarantee and warranty for your peace of mind." 
        }
    
        
    ]
};

// Service Manager Class
class ServiceManager {
    constructor() {
        this.services = window.ServicesConfig || {};
    }

    init() {
        console.log('ServiceManager initializing...', this.services); // Debug line
        this.renderServices();
        this.renderServiceOptions();
    }

    renderServices() {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) {
            console.error('Services grid element not found');
            return;
        }

        const serviceCards = Object.entries(this.services).map(([id, service]) => `
            <div class="service-card" onclick="ServiceModal.open('${id}')">
                <div class="service-card-tooltip">Click for full details</div>
                <div class="price-tag">${service.price}</div>
                <span class="service-icon">${service.icon}</span>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <button class="quote-btn" onclick="event.stopPropagation(); ContactManager.openQuote('${service.title}')">Get Quote</button>
            </div>
        `).join('');

        servicesGrid.innerHTML = serviceCards;
    }

    renderServiceOptions() {
        const serviceSelect = document.getElementById('serviceType');
        if (!serviceSelect) return;

        serviceSelect.innerHTML = `
            <option value="">Select a service...</option>
            ${Object.entries(this.services).map(([id, service]) => 
                `<option value="${id}">${service.title}</option>`
            ).join('')}
            <option value="other">Other</option>
        `;
    }

    getService(serviceId) {
        return this.services[serviceId];
    }

    getAllServices() {
        return this.services;
    }

    searchServices(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(this.services)
            .filter(([id, service]) => 
                service.title.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.features.some(feature => feature.toLowerCase().includes(searchTerm))
            );
    }
}

// Service Modal Manager Class
class ServiceModal {
    static open(serviceId) {
        const service = serviceManager.getService(serviceId);
        if (!service) return;

        const modal = document.getElementById('serviceModal');
        const title = document.getElementById('serviceModalTitle');
        const price = document.getElementById('serviceModalPrice');
        const description = document.getElementById('serviceModalDescription');
        const features = document.getElementById('serviceModalFeatures');

        title.textContent = service.title;
        price.textContent = service.price;
        description.textContent = service.description;

        features.innerHTML = service.features.map(feature => `<li>${feature}</li>`).join('');

        serviceManager.currentService = service.title;
        modal.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    static close() {
        const modal = document.getElementById('serviceModal');
        modal.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    static openQuote() {
        this.close();
        ContactManager.openQuote(serviceManager.currentService);
    }
}

// Contact Manager Class
class ContactManager {
    static showContactPage() {
        const contactPage = document.getElementById('contactPage');
        contactPage.classList.add('active');
        window.scrollTo(0, 0);
        this.hideMainSections();
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }

    static hideContactPage() {
        const contactPage = document.getElementById('contactPage');
        contactPage.classList.remove('active');
        window.scrollTo(0, 0);
        this.showMainSections();
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    static hideMainSections() {
        const sections = ['hero', 'services', 'contact', 'why-us'];
        sections.forEach(section => {
            const element = document.querySelector(`.${section}`);
            if (element) element.style.display = 'none';
        });
    }

    static showMainSections() {
        const sections = {
            'hero': 'flex',
            'services': 'block', 
            'contact': 'block',
            'why-us': 'block'
        };
        
        Object.entries(sections).forEach(([section, display]) => {
            const element = document.querySelector(`.${section}`);
            if (element) element.style.display = display;
        });
    }

    static openQuote(serviceName) {
        const serviceSelect = document.getElementById('serviceType');
        const contactSection = document.getElementById('contact');
        
        // Find and select the matching service
        Array.from(serviceSelect.options).forEach(option => {
            if (option.text === serviceName) {
                option.selected = true;
            }
        });

        // Close any open modals
        ServiceModal.close();

        // Scroll to contact form
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    static init() {
        this.renderContactInfo();
    }

    static renderContactInfo() {
        const contactInfoItems = document.getElementById('contactInfoItems');
        if (!contactInfoItems) return;

        contactInfoItems.innerHTML = AppConfig.contactInfo.map(item => `
            <div class="contact-info-item">
                <div class="contact-info-icon">${item.icon}</div>
                <div class="contact-info-text">
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </div>
            </div>
        `).join('');
    }
}

// Content Manager Class
class ContentManager {
    static init() {
        this.renderWhyUs();
        this.renderFooter();
    }

    static renderWhyUs() {
        const whyUsGrid = document.getElementById('whyUsGrid');
        if (!whyUsGrid) return;

        whyUsGrid.innerHTML = AppConfig.whyUsData.map(item => `
            <div class="why-us-card">
                <div class="why-us-icon">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    static renderFooter() {
        const footerContent = document.getElementById('footerContent');
        if (!footerContent) return;

        footerContent.innerHTML = `
            <div class="footer-section">
                <h4>${AppConfig.company.name}</h4>
                <p>Professional cleaning services across Brisbane's North Side. Committed to quality, reliability, and customer satisfaction.</p>
            </div>
            
            <div class="footer-section">
                <h4>Contact Info</h4>
                <p>📞 ${AppConfig.company.phone}</p>
                <p>📧 ${AppConfig.company.email}</p>
                <p>📍 ${AppConfig.company.address}</p>
                <p>🕒 ${AppConfig.company.hours}</p>
                <p>📌 ABN ${AppConfig.company.abn}</p>
            </div>
            
            <div class="footer-section">
                <h4>Quick Links</h4>
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#why-us">Why Choose Us</a>
                <a href="#contact">Contact</a>
            </div>
        `;
    }
}

// Form Manager Class
class FormHandler {
    static init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Create hidden iframe
        let iframe = document.getElementById('hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden_iframe';
            iframe.id = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        let submitted = false;

        // Handle iframe load
        iframe.addEventListener('load', () => {
            if (submitted) {
                const successScreen = document.getElementById('successScreen');
                const formContainer = document.querySelector('.form-container');
                
                // Hide form and show success screen
                if (formContainer && successScreen) {
                    formContainer.style.display = 'none';
                    successScreen.style.display = 'block';
                }

                // Reset form and state
                form.reset();
                submitted = false;
                this.resetSubmitButton();
            }
        });

        // Handle form submit
        form.addEventListener('submit', (e) => {
            this.showLoadingState();
            submitted = true;
        });

        // Handle "Send Another Message" button
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.resetForm());
        }
    }

    static showLoadingState() {
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (submitBtn && spinner) {
            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        }
    }

    static resetSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        if (submitBtn && spinner) {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            submitBtn.querySelector('.btn-text').textContent = 'Send Message';
        }
    }

    static resetForm() {
        const successScreen = document.getElementById('successScreen');
        const formContainer = document.querySelector('.form-container');
        
        if (formContainer && successScreen) {
            successScreen.style.display = 'none';
            formContainer.style.display = 'block';
        }

        const form = document.getElementById('contactForm');
        if (form) {
            form.reset();
        }
    }
}

// Event Manager Class
class EventManager {
    static init() {
        this.bindGlobalEvents();
        this.bindKeyboardEvents();
    }

    static bindGlobalEvents() {
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const serviceModal = document.getElementById('serviceModal');
            if (event.target === serviceModal) {
                ServiceModal.close();
            }
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    static bindKeyboardEvents() {
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ServiceModal.close();
                
                const contactPage = document.getElementById('contactPage');
                if (contactPage && contactPage.classList.contains('active')) {
                    ContactManager.hideContactPage();
                }
            }
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service manager
    const serviceManager = new ServiceManager();
    serviceManager.init();
    window.serviceManager = serviceManager; // Make it globally available

    // Initialize other managers
    ContactManager.init();
    ContentManager.init();
    FormHandler.init();
    EventManager.init();
    
    console.log('Brisbane Carpet and Bond Cleaners website initialized successfully!');
});

// Review Manager Class
class ReviewManager {
    static init() {
        const reviewElements = {
            rating: document.getElementById('googleRating'),
            totalReviews: document.getElementById('totalReviews'),
            reviewLink: document.getElementById('googleReviewLink')
        };

        if (window.ReviewConfig) {
            reviewElements.rating.textContent = ReviewConfig.rating;
            reviewElements.totalReviews.textContent = ReviewConfig.totalReviews;
            reviewElements.reviewLink.href = ReviewConfig.googlePageUrl;
        }
    }
}

// Add to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service manager
    const serviceManager = new ServiceManager();
    serviceManager.init();
    window.serviceManager = serviceManager; // Make it globally available

    // Initialize other managers
    ContactManager.init();
    ContentManager.init();
    FormHandler.init();
    EventManager.init();
    
    console.log('Brisbane Carpet and Bond Cleaners website initialized successfully!');
    ReviewManager.init();
});

// Export for global access
window.serviceManager = serviceManager;
window.ServiceModal = ServiceModal;
window.ContactManager = ContactManager;