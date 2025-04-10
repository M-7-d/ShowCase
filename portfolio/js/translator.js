// Initialize Supabase client
const supabaseUrl = 'https://uvrozprcewgwybuhguai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cm96cHJjZXdnd3lidWhndWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTI1MTAsImV4cCI6MjA1ODMyODUxMH0.2EgqTZjwcOv_kKP38g9nsou1ECsR_ybnAaGZduXWlaQ';
const DEFAULT_IMAGE = 'img/project1.jpg';

// Global variables for pagination
let currentPage = 1;
let productsPerPage = 9;
let allProducts = [];
let supabase;
let translationInitialized = false;

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing...');
    
    // Add translator.css to the head if it's not already there
    if (!document.querySelector('link[href="css/translator.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/translator.css';
        document.head.appendChild(link);
    }
    
    initializeApp();
    handleResponsive();
    setupScrollAnimations();
    initializeLanguagePicker();
    
    // Listen for Google Translate changes to fix styling issues
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && document.body.classList.contains('translated-rtl')) {
                    // Apply RTL fixes
                    document.documentElement.dir = 'rtl';
                    document.body.classList.add('rtl');
                } else if (mutation.type === 'childList' && document.body.classList.contains('translated-ltr')) {
                    // Reset to LTR
                    document.documentElement.dir = 'ltr';
                    document.body.classList.remove('rtl');
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        });
    }
    
    // Enhanced search functionality with debounce
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentPage = 1; // Reset to first page on new search
            loadProducts(e.target.value);
        }, 300));
    }
    
    // Fix Google Translate frame overlap
    window.addEventListener('load', function() {
        setTimeout(function() {
            const frameWrapper = document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd');
            if (frameWrapper) {
                frameWrapper.style.display = 'none';
            }
            document.body.style.top = '0 !important';
        }, 1000);
    });
    
    // Apply saved language after a delay to ensure Google Translate is loaded
    setTimeout(function() {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            console.log('Trying to apply saved language on load:', savedLanguage);
            applyLanguage(savedLanguage);
        }
    }, 1500);
    
    // Call centering function after a delay
    setTimeout(centerTextInTranslateIframe, 2000);
    
    // Add MutationObserver to detect when translate iframe is added to DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // Check if any of the added nodes are iframes
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'IFRAME') {
                        // Wait for iframe to load
                        setTimeout(centerTextInTranslateIframe, 300);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also try to center text whenever language is changed
    const originalApplyLanguage = window.applyLanguage;
    if (originalApplyLanguage) {
        window.applyLanguage = function(langCode) {
            const result = originalApplyLanguage(langCode);
            setTimeout(centerTextInTranslateIframe, 500);
            return result;
        };
    }
});

// Initialize the language picker functionality
function initializeLanguagePicker() {
    console.log('Initializing language picker...');
    
    // Handle language toggle button click
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            console.log('Language toggle clicked');
            const translateElement = document.getElementById('google_translate_element');
            if (translateElement) {
                translateElement.classList.toggle('show-translator');
                console.log('Toggled show-translator class');
                
                // Ensure Google Translate is initialized
                ensureGoogleTranslateInitialized();
                
                // Add some delay and then try to center text in iframe
                setTimeout(centerTextInTranslateIframe, 300);
            }
        });
    }
    
    // Handle clicks outside the language dropdown to close it
    document.addEventListener('click', function(event) {
        const translateElement = document.getElementById('google_translate_element');
        const languageToggle = document.getElementById('language-toggle');
        
        if (translateElement && 
            translateElement.classList.contains('show-translator') && 
            !translateElement.contains(event.target) &&
            languageToggle && 
            !languageToggle.contains(event.target)) {
            
            translateElement.classList.remove('show-translator');
        }
    });
}

// Function to ensure Google Translate is initialized
function ensureGoogleTranslateInitialized() {
    // Check if the combo element exists
    const googleCombo = document.querySelector('.goog-te-combo');
    
    // If not, and we haven't already tried to initialize it
    if (!googleCombo && !translationInitialized && window.google && window.google.translate) {
        console.log('Trying to initialize Google Translate manually');
        try {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ar,tr',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                autoDisplay: false
            }, 'google_translate_element');
            
            translationInitialized = true;
            console.log('Google Translate manually initialized');
            
            // After initialization, try to apply saved language
            setTimeout(function() {
                const savedLanguage = localStorage.getItem('selectedLanguage');
                if (savedLanguage) {
                    console.log('Applying saved language:', savedLanguage);
                    applyLanguage(savedLanguage);
                }
            }, 1000);
        } catch (error) {
            console.error('Error initializing Google Translate:', error);
        }
    }
    
    // Force visibility of Google Translate element temporarily to work with events
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement) {
        const originalDisplay = translateElement.style.display;
        translateElement.style.visibility = 'visible';
        translateElement.style.height = 'auto';
        translateElement.style.opacity = '1';
        
        // Reset after a brief moment
        setTimeout(() => {
            translateElement.style.visibility = 'hidden';
            translateElement.style.height = '0';
            translateElement.style.opacity = '0';
            translateElement.style.display = originalDisplay;
        }, 500);
    }
    
    return !!googleCombo;
}

// Add a new function to reliably apply language change
function applyLanguage(langCode) {
    const selectElement = document.querySelector('.goog-te-combo');
    if (!selectElement) {
        console.log('Google Translate dropdown not found');
        setTimeout(() => {
            applyLanguage(langCode); // Try again after a short delay
        }, 1000);
        return false;
    }
    
    console.log('Applying language:', langCode);
    
    try {
        // Set the value
        selectElement.value = langCode;
        
        // Trigger multiple events for maximum compatibility
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        selectElement.dispatchEvent(new MouseEvent('change', { bubbles: true }));
        
        // Try to directly call Google's translation functions if available
        if (typeof selectElement.onchange === 'function') {
            selectElement.onchange();
        }
        
        // Additional attempt to trigger Google's internal translation
        if (typeof google !== 'undefined' && 
            google.translate && 
            google.translate.TranslateElement) {
            console.log('Using Google Translate API directly');
        }
        
        // Update all language displays on the page
        updateAllLanguageDisplays(langCode);
        
        // Close dropdown menus
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(menu => {
            menu.classList.remove('show');
        });
        
        // Store the selection
        localStorage.setItem('selectedLanguage', langCode);
        
        console.log('Language change completed');
        return true;
    } catch (error) {
        console.error('Error in applyLanguage:', error);
        return false;
    }
}

// Make applyLanguage accessible globally
window.applyLanguage = applyLanguage;

// Update all language displays on the page
function updateAllLanguageDisplays(langCode) {
    // Find all elements that display current language
    const languageDisplays = [
        document.getElementById('current-language'),
        document.getElementById('mobile-current-language')
    ];
    
    let displayText = 'EN';
    switch(langCode) {
        case 'ar': displayText = 'AR'; break;
        case 'tr': displayText = 'TR'; break;
        default: displayText = 'EN';
    }
    
    // Update all found language displays
    languageDisplays.forEach(element => {
        if (element) {
            element.textContent = displayText;
        }
    });
    
    console.log('All language displays updated to:', displayText);
}

// Fetch and display products from Supabase
async function loadProducts(searchQuery = '') {
    if (!supabase) {
        console.error('Supabase client not initialized');
        return;
    }

    const productCards = document.getElementById('productCards');
    const paginationContainer = document.getElementById('pagination');

    if (!productCards) {
        return;
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;

        productCards.innerHTML = '';

        if (!data || data.length === 0) {
            productCards.innerHTML = `<p class="no-products">No products available at the moment.</p>`;
            paginationContainer.innerHTML = '';
            return;
        }

        // Filter products based on search query
        allProducts = searchQuery
            ? data.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : data;

        // Calculate pagination
        const totalPages = Math.ceil(allProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = allProducts.slice(startIndex, endIndex);

        // Display current page products
        currentProducts.forEach(product => {
            const primaryImage = getFirstImage(product.image_urls);
            
            productCards.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${primaryImage}" alt="${product.name}">
                    <div class="product-overlay">
                        <a href="cart.html?id=${product.id}" class="view-details-btn">
                            <i class="fas fa-eye"></i> <font color="white">View Details</font>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <span class="category"><font color="black">${product.category}</font></span>
                    <h3 class="product-title"><font color="black">${product.name}</font></h3>
                    <p class="product-description"><font color="black">${product.description}</font></p>
                    <div class="product-actions">
                        <a href="cart.html?id=${product.id}" class="details-btn">
                            <i class="fas fa-shopping-cart"></i> <font color="white">View Details</font>
                        </a>
                    </div>
                </div>
            </div>
            `;
        });

        // Update pagination
        updatePagination(totalPages);

    } catch (error) {
        console.error('Error fetching products:', error.message);
        if (productCards) {
            productCards.innerHTML = `<p class="error-message">Failed to load products. Please try again later.</p>`;
        }
    }
}

// Function to update pagination buttons
function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    let paginationHTML = '';
    const isRTL = document.documentElement.dir === 'rtl';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-${isRTL ? 'right' : 'left'}"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-${isRTL ? 'left' : 'right'}"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Function to change page
function changePage(newPage) {
    if (newPage < 1 || newPage > Math.ceil(allProducts.length / productsPerPage)) return;
    currentPage = newPage;
    loadProducts();
}

// Helper function to get first image
function getFirstImage(imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return DEFAULT_IMAGE;
    }
    return imageUrls[0];
}

// Helper function to initialize Supabase
function initializeSupabase() {
    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
            console.log('Supabase initialized successfully');
            return true;
        }
        console.log('window.supabase not available yet');
        return false;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return false;
    }
}

// Wait for document and Supabase to be ready
function initializeApp() {
    if (initializeSupabase()) {
        loadProducts();
    } else {
        console.log('Retrying Supabase initialization in 500ms...');
        setTimeout(initializeApp, 500);
    }
}

// Add debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced responsive handling
function handleResponsive() {
    const header = document.querySelector('header');
    const navLinks = document.getElementById('links');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.querySelector('.close_menu');
    const allLinks = document.querySelectorAll('.links a');

    // Header scroll effect with throttle
    let lastScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollPosition >= 50) {
                    header.classList.add('active');
                } else {
                    header.classList.remove('active');
                }
                ticking = false;
            });

            ticking = true;
        }
    });

    // Mobile menu functionality with improved animations
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            
            // Handle RTL direction for mobile menu
            if (document.documentElement.dir === 'rtl') {
                navLinks.style.right = '0';
            } else {
                navLinks.style.left = '0';
            }
            
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            
            // Handle RTL direction for mobile menu
            if (document.documentElement.dir === 'rtl') {
                navLinks.style.right = '-100%';
            } else {
                navLinks.style.left = '-100%';
            }
            
            navLinks.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
                
            // Handle RTL direction for mobile menu
            if (document.documentElement.dir === 'rtl') {
                navLinks.style.right = '-100%';
            } else {
                navLinks.style.left = '-100%';
            }
                
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link with smooth scroll
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                // Handle RTL direction for mobile menu
                if (document.documentElement.dir === 'rtl') {
                    navLinks.style.right = '-100%';
                } else {
                    navLinks.style.left = '-100%';
                }
                
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992 && navLinks && navLinks.classList.contains('active')) {
                // Reset styles when viewport becomes larger
                navLinks.style.left = '';
                navLinks.style.right = '';
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
            updateProductGrid();
        }, 250);
    });
}

// Update product grid layout based on screen size
function updateProductGrid() {
    const productCards = document.getElementById('productCards');
    if (!productCards) return;

    const width = window.innerWidth;
    let columns;

    if (width >= 1200) columns = 3;
    else if (width >= 768) columns = 2;
    else columns = 1;

    productsPerPage = columns * 3; // Update products per page based on grid
    
    // Adjust grid gap for better mobile display
    if (width <= 576) {
        productCards.style.gap = '15px';
    } else if (width <= 768) {
        productCards.style.gap = '20px';
    } else {
        productCards.style.gap = '30px';
    }
    
    currentPage = 1; // Reset to first page
    loadProducts(); // Reload products with new grid
}

// Enhanced animation on scroll with Intersection Observer
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project_box, .feature-card, .product-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}

// Function to change language to a specific code
window.changeLanguage = function(langCode) {
    console.log(`Global changeLanguage called for: ${langCode}`);
    
    // Try to apply language using our improved function first
    if (typeof window.applyLanguage === 'function') {
        return window.applyLanguage(langCode);
    }
    
    // Fallback to original method
    const selectElement = document.querySelector('.goog-te-combo');
    if (!selectElement) {
        console.error("Google Translate dropdown not found. Retrying...");
        ensureGoogleTranslateInitialized();
        setTimeout(() => window.changeLanguage(langCode), 1000);
        return false;
    }
    
    try {
        // Set the value
        selectElement.value = langCode;
        
        // Trigger multiple events
        selectElement.dispatchEvent(new Event('change', {bubbles: true}));
        selectElement.dispatchEvent(new MouseEvent('change', {bubbles: true}));
        
        // Try to call Google's internal function
        if (typeof selectElement.onchange === 'function') {
            selectElement.onchange();
        }
        
        // Update language display and close dropdowns
        updateAllLanguageDisplays(langCode);
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
        
        // Store selection
        localStorage.setItem('selectedLanguage', langCode);
        
        return true;
    } catch (error) {
        console.error('Error in changeLanguage:', error);
        return false;
    }
};

// Exposing functions globally
window.changePage = changePage;

// Function to center text in Google Translate iframe
function centerTextInTranslateIframe() {
    try {
        // Find all iframes on the page
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            // Try to access iframe content
            try {
                if (iframe.classList.contains('goog-te-menu-frame') || 
                    iframe.contentWindow.document.body.classList.contains('goog-te-menu2') ||
                    iframe.contentWindow.document.querySelector('.goog-te-menu2')) {
                    
                    console.log('Found Google Translate iframe, applying centering styles');
                    
                    // Create a style element
                    const style = iframe.contentDocument.createElement('style');
                    style.textContent = `
                        body, table, td, div, span {
                            text-align: center !important;
                        }
                        
                        .goog-te-menu2-item div, 
                        .goog-te-menu2-item:link div, 
                        .goog-te-menu2-item:visited div, 
                        .goog-te-menu2-item:active div {
                            text-align: center !important;
                            justify-content: center !important;
                            width: 100% !important;
                            display: flex !important;
                            align-items: center !important;
                        }
                        
                        .goog-te-menu2 {
                            width: 100% !important;
                        }
                        
                        .goog-te-menu2-colpad {
                            display: none !important;
                        }
                    `;
                    
                    // Append the style to the iframe's document
                    iframe.contentDocument.head.appendChild(style);
                }
            } catch (err) {
                // Catch cross-origin errors
                console.log('Could not access iframe content:', err);
            }
        });
    } catch (error) {
        console.error('Error in centerTextInTranslateIframe:', error);
    }
} 