// services-config.js
// Separate configuration file for all cleaning services
// This file can be updated independently without touching the main application code

window.ServicesConfig = {
    'bond-cleaning': {
        title: 'End of Lease Cleaning',
        icon: '🏠',
        price: 'From $240',
        description: 'Complete bond cleaning service designed to help secure your full deposit return with thorough, checklist-compliant cleaning.',
        features: [
            'Deep cleaning of all rooms: walls, skirting boards, light fittings, switches, doors, wardrobes',
            'Windows cleaned inside and outside where accessible',
            'Kitchen: full oven, cooktop, rangehood, cupboard interiors, benchtops, splashbacks, sinks',
            'Bathrooms: showers, mirrors, tiles, grout, exhaust fans, vanities, toilets',
            'All floors vacuumed and mopped with professional-grade products',
            'Custom packages available for furnished and unfurnished properties'
        ],
        category: 'residential',
        popular: true
    },
    'carpet-cleaning': {
        title: 'Carpet Cleaning',
        icon: '🧼',
        price: 'From $99',
        description: 'Professional steam cleaning and dry cleaning services for all carpet types, removing stains, odors, and allergens.',
        features: [
            'Hot water extraction (steam cleaning) and dry cleaning options',
            'Removes dirt, dust mites, allergens, stains, pet odours, food spills, and bacteria',
            'Pre-treatment of stubborn stains and high-traffic areas',
            'Fast-drying technology for minimal disruption',
            'Suitable for all carpet types and conditions'
        ],
        category: 'cleaning',
        popular: true
    },
    'dead-animal': {
        title: 'Dead Animal Removal',
        icon: '🐀',
        price: 'From $150',
        description: 'Safe and discreet removal service with complete sanitation to eliminate health hazards and odors.',
        features: [
            'Safe removal from ceilings, crawl spaces, walls, or underfloor areas',
            'Hospital-grade disinfectants eliminate harmful bacteria and parasites',
            'Complete deodorisation treatments to neutralise foul smells',
            'Prevention measures and sealing of entry points',
            'Emergency same-day response available'
        ],
        category: 'emergency',
        emergency: true
    },
    'upholstery-cleaning': {
        title: 'Upholstery Cleaning',
        icon: '🛋️',
        price: 'From $89',
        description: 'Expert cleaning for all types of upholstered furniture using specialized, fabric-safe cleaning methods.',
        features: [
            'Steam or dry cleaning for fabric, suede, velvet, or leather',
            'Removes food stains, sweat marks, body oils, dust, and pet odours',
            'Deep extraction removes embedded allergens and bacteria',
            'Optional deodorising and fabric protection available',
            'Suitable for all furniture types'
        ],
        category: 'cleaning'
    },
    'pet-hair-removal': {
        title: 'Pet Hair Removal',
        icon: '🐾',
        price: 'From $79',
        description: 'Specialized service for pet owners to remove stubborn embedded pet hair from all surfaces and fabrics.',
        features: [
            'Detailed vacuuming and brushing of carpets, upholstery, rugs',
            'Reduces allergens, odours, and dander build-up',
            'Specialised tools access tight corners and textured fabrics',
            'Perfect for households with cats, dogs, or other pets',
            'Available for home and vehicle interiors'
        ],
        category: 'specialized'
    },
    'exterior-cleaning': {
        title: 'Exterior Cleaning',
        icon: '🏡',
        price: 'From $120',
        description: 'High-pressure washing service for driveways, walls, fences, and outdoor surfaces to restore their original appearance.',
        features: [
            'High-pressure washing for all external surfaces',
            'Removes dirt, algae, moss, mould, oil stains, and cobwebs',
            'Suitable for driveways, walls, fences, patios, decks',
            'Eco-friendly cleaning methods safe for gardens and pets',
            'Restores curb appeal and prolongs surface lifespan'
        ],
        category: 'exterior'
    },
    'grout-cleaning': {
        title: 'Bathroom Grout Cleaning',
        icon: '🚿',
        price: 'From $95',
        description: 'Deep cleaning and restoration of bathroom grout lines, removing mold, mildew, and discoloration.',
        features: [
            'Deep cleaning removes mould, mildew, limescale, soap scum',
            'Targeted treatment of tiles, shower cubicles, backsplashes',
            'Specialised scrubbers restore grout to original colour',
            'Optional resealing protects against future staining',
            'Prevents mould growth and extends grout life'
        ],
        category: 'specialized'
    },
    'car-detailing': {
        title: 'Car Detailing',
        icon: '🚗',
        price: 'From $85',
        description: 'Complete interior and exterior vehicle cleaning service to restore your car\'s cleanliness and presentation.',
        features: [
            'Exterior: wash, wax, paint protection, tyre shine, window polishing',
            'Interior: vacuuming, seat shampooing, stain removal, leather treatment',
            'Dashboard wipe-down and complete deodorising',
            'Pet hair and sand removal for family vehicles',
            'Suitable for regular upkeep or pre-sale preparation'
        ],
        category: 'automotive'
    },
    'spring-cleaning': {
        title: 'Spring Cleaning',
        icon: '🌼',
        price: 'From $180',
        description: 'Comprehensive deep cleaning service covering your entire home with attention to often-neglected areas.',
        features: [
            'Ceiling fans, light fittings, door frames, baseboards, vents',
            'Behind furniture and hard-to-reach areas',
            'Kitchen degreasing, appliance cleaning, cupboard interiors',
            'Pantry organisation and bathroom sanitisation',
            'Perfect for seasonal refresh or post-renovation cleanup'
        ],
        category: 'residential',
        seasonal: true
    },
    'flood-cleaning': {
        title: 'Flood Restoration',
        icon: '🌊',
        price: 'From $350',
        description: 'Emergency cleaning and restoration service for homes affected by flooding, including water extraction and sanitization.',
        features: [
            'Water extraction, structural drying, mould treatment',
            'Damage assessment and restoration planning',
            'Cleaning of floors, walls, cabinetry, and belongings',
            'Removal of mud, silt, debris, and waste',
            'Odour removal and mould prevention measures'
        ],
        category: 'emergency',
        emergency: true
    }
};

// Helper functions for service management
window.ServiceUtils = {
    // Get services by category
    getServicesByCategory: function(category) {
        return Object.entries(window.ServicesConfig)
            .filter(([id, service]) => service.category === category)
            .reduce((acc, [id, service]) => {
                acc[id] = service;
                return acc;
            }, {});
    },

    // Get popular services
    getPopularServices: function() {
        return Object.entries(window.ServicesConfig)
            .filter(([id, service]) => service.popular)
            .reduce((acc, [id, service]) => {
                acc[id] = service;
                return acc;
            }, {});
    },

    // Get emergency services
    getEmergencyServices: function() {
        return Object.entries(window.ServicesConfig)
            .filter(([id, service]) => service.emergency)
            .reduce((acc, [id, service]) => {
                acc[id] = service;
                return acc;
            }, {});
    },

    // Add new service
    addService: function(id, serviceData) {
        window.ServicesConfig[id] = serviceData;
        // Trigger re-render if service manager exists
        if (window.serviceManager) {
            window.serviceManager.init();
        }
    },

    // Update existing service
    updateService: function(id, updates) {
        if (window.ServicesConfig[id]) {
            window.ServicesConfig[id] = { ...window.ServicesConfig[id], ...updates };
            // Trigger re-render if service manager exists
            if (window.serviceManager) {
                window.serviceManager.init();
            }
        }
    },

    // Remove service
    removeService: function(id) {
        delete window.ServicesConfig[id];
        // Trigger re-render if service manager exists
        if (window.serviceManager) {
            window.serviceManager.init();
        }
    },

    // Get all categories
    getCategories: function() {
        const categories = new Set();
        Object.values(window.ServicesConfig).forEach(service => {
            categories.add(service.category);
        });
        return Array.from(categories);
    },

    // Sort services by price
    sortServicesByPrice: function(ascending = true) {
        const entries = Object.entries(window.ServicesConfig);
        return entries.sort(([,a], [,b]) => {
            const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
            const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
            return ascending ? priceA - priceB : priceB - priceA;
        });
    },

    // Search services
    searchServices: function(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(window.ServicesConfig)
            .filter(([id, service]) => 
                service.title.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.features.some(feature => feature.toLowerCase().includes(searchTerm))
            )
            .reduce((acc, [id, service]) => {
                acc[id] = service;
                return acc;
            }, {});
    }
};

const ReviewConfig = {
    rating: "4.9",
    totalReviews: "150+",
    googlePageUrl: "https://www.google.com"
};

// Make it available globally
window.ReviewConfig = ReviewConfig;

const AppSettings = {
    googleSheet: {
        url: 'YOUR_DEPLOYED_WEBAPP_URL',
        enabled: true
    }
};

// Make it available globally
window.AppSettings = AppSettings;

// Example of how to add a new service:
/*
window.ServiceUtils.addService('window-cleaning', {
    title: 'Window Cleaning',
    icon: '🪟',
    price: 'From $65',
    description: 'Professional window cleaning for residential and commercial properties.',
    features: [
        'Interior and exterior window cleaning',
        'Screen cleaning and frame wiping',
        'Streak-free finish guaranteed',
        'Safe cleaning methods for all window types',
        'Regular maintenance packages available'
    ],
    category: 'cleaning'
});

// Example of how to update pricing:
window.ServiceUtils.updateService('carpet-cleaning', {
    price: 'From $89'
});

// Example of how to remove a service:
window.ServiceUtils.removeService('dead-animal');
*/