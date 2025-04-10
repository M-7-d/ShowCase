// Initialize Supabase client
const supabaseUrl = 'https://uvrozprcewgwybuhguai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cm96cHJjZXdnd3lidWhndWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTI1MTAsImV4cCI6MjA1ODMyODUxMH0.2EgqTZjwcOv_kKP38g9nsou1ECsR_ybnAaGZduXWlaQ';
let supabase;

// Function to update all translatable elements
function updateTranslations() {
    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = getTranslation(key);
    });
}

// Function to update language
function updateLanguage(lang) {
    setCurrentLang(lang);
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update translations
    updateTranslations();
    
    // Reload product details to update translations
    loadProductDetails();
}

// Initialize Supabase
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

// Get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product details
async function loadProductDetails() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error('No product ID found in URL');
        return;
    }

    try {
        if (!supabase && !initializeSupabase()) {
            throw new Error('Failed to initialize Supabase');
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) throw error;
        if (!data) {
            console.error('Product not found');
            return;
        }

        updateProductUI(data);
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

// Update UI with product data
function updateProductUI(data) {
    // Update product information
    updateElement('productName', data.name);
    updateElement('productCategory', data.category);
    updateElement('productCategoryMeta', data.category);
    updateElement('productDescription', data.description);
    updateElement('productId', data.id);
    
    updateProductImages(data);
    updateWhatsAppButton(data);
}

// Update element with fade animation
function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.add('fade-out');
    setTimeout(() => {
        element.textContent = value;
        element.classList.remove('fade-out');
        element.classList.add('fade-in');
    }, 200);
}

let currentImageIndex = 0;
let productImages = [];

// Enhanced touch navigation with better performance
function initializeTouchNavigation() {
    const mainImage = document.getElementById('productMainImage');
    if (!mainImage) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let startTime = 0;

    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        startTime = Date.now();
        isSwiping = true;
    }, { passive: true });

    mainImage.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainImage.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const endTime = Date.now();
        const swipeDuration = endTime - startTime;
        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;
        const timeThreshold = 300; // milliseconds

        if (Math.abs(swipeDistance) > swipeThreshold && swipeDuration < timeThreshold) {
            if (swipeDistance > 0) {
                navigateImages('prev');
            } else {
                navigateImages('next');
            }
        }
    }, { passive: true });
}

// Optimize image loading for mobile
function updateProductImages(data) {
    if (!data.image_urls?.length) return;

    productImages = data.image_urls;
    currentImageIndex = 0;

    const mainImage = document.getElementById('productMainImage');
    if (!mainImage) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Set appropriate image size based on device
    mainImage.style.maxHeight = isMobile ? '300px' : 'none';
    mainImage.style.width = '100%';
    mainImage.style.objectFit = 'contain';

    // Load main image with lazy loading
    mainImage.src = productImages[0];
    mainImage.alt = data.name;

    // Update thumbnails with optimized loading
    updateThumbnails();
}

// Optimize thumbnail loading
function updateThumbnails() {
    const additionalImagesContainer = document.getElementById('additionalImages');
    if (!additionalImagesContainer) return;
    
    additionalImagesContainer.innerHTML = productImages.map((url, index) => `
        <img src="${url}" 
             alt="Product thumbnail ${index + 1}" 
             class="additional-image ${index === currentImageIndex ? 'active' : ''}" 
             onclick="changeMainImage('${url}', ${index})"
             loading="lazy"
             style="animation-delay: ${index * 0.15}s">
    `).join('');
}

// Add performance optimization for image changes
function changeMainImage(src, index) {
    const mainImage = document.getElementById('productMainImage');
    if (!mainImage) return;
    
    mainImage.classList.add('fade-out');
    currentImageIndex = index;
    
    // Preload the new image
    const img = new Image();
    img.onload = () => {
        mainImage.src = src;
        mainImage.classList.remove('fade-out');
        mainImage.classList.add('fade-in');
        updateThumbnails();
    };
    img.src = src;
}

// Navigate images
function navigateImages(direction) {
    if (!productImages.length) return;

    const isRTL = document.documentElement.dir === 'rtl';
    
    if (direction === 'next') {
        currentImageIndex = isRTL ? 
            (currentImageIndex - 1 + productImages.length) % productImages.length :
            (currentImageIndex + 1) % productImages.length;
    } else {
        currentImageIndex = isRTL ?
            (currentImageIndex + 1) % productImages.length :
            (currentImageIndex - 1 + productImages.length) % productImages.length;
    }

    changeMainImage(productImages[currentImageIndex], currentImageIndex);
}

// Update WhatsApp button
function updateWhatsAppButton(data) {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (!whatsappBtn) return;
    
    const message = encodeURIComponent(`Hi, I'm interested in ${data.name} (${data.category})`);
    whatsappBtn.href = `https://wa.me/905301288498?text=${message}`;
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const links = document.getElementById('links');
    const closeMenu = document.querySelector('.close_menu');
    const body = document.body;
    
    // Only initialize if menu elements exist
    if (!menuToggle || !links) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        links.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    // Close menu
    closeMenu?.addEventListener('click', () => {
        links.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    });
    
    // Close menu when clicking on a link
    const navLinks = links.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (links.classList.contains('active') && 
            !links.contains(e.target) && 
            e.target !== menuToggle) {
            links.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && links.classList.contains('active')) {
            links.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Add resize handler with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const productData = document.getElementById('productName')?.dataset.productData;
        if (productData) {
            updateProductImages(JSON.parse(productData));
        }
    }, 250);
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure Google Translate doesn't break UI elements
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
    
    loadProductDetails();
    initializeTouchNavigation();
    
    // Fix Google Translate frame overlap
    setTimeout(function() {
        const frameWrapper = document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd');
        if (frameWrapper) {
            frameWrapper.style.display = 'none';
        }
        document.body.style.top = '0 !important';
    }, 1000);
});

// Make image navigation functions global for HTML event handlers
window.changeMainImage = changeMainImage;
window.navigateImages = navigateImages; 