// Initialize Supabase client
const supabaseUrl = 'https://uvrozprcewgwybuhguai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cm96cHJjZXdnd3lidWhndWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTI1MTAsImV4cCI6MjA1ODMyODUxMH0.2EgqTZjwcOv_kKP38g9nsou1ECsR_ybnAaGZduXWlaQ';
let supabase;

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
    element.classList.add('fade-out');
    setTimeout(() => {
        element.textContent = value;
        element.classList.remove('fade-out');
        element.classList.add('fade-in');
    }, 200);
}

let currentImageIndex = 0;
let productImages = [];

// Update product images
function updateProductImages(data) {
    if (!data.image_urls?.length) return;

    productImages = data.image_urls;
    currentImageIndex = 0;

    const mainImage = document.getElementById('productMainImage');
    
    // Mobil cihazlar için daha küçük görüntüler
    if (window.innerWidth <= 768) {
        mainImage.style.maxHeight = '300px';
    } else {
        mainImage.style.maxHeight = 'none';
    }

    mainImage.src = productImages[0];
    mainImage.alt = data.name;

    updateThumbnails();
}

// Update thumbnails
function updateThumbnails() {
    const additionalImagesContainer = document.getElementById('additionalImages');
    additionalImagesContainer.innerHTML = productImages.map((url, index) => `
        <img src="${url}" 
             alt="Product thumbnail" 
             class="additional-image ${index === currentImageIndex ? 'active' : ''}" 
             onclick="changeMainImage('${url}', ${index})"
             style="animation-delay: ${index * 0.15}s">
    `).join('');
}

// Change main image with animation
function changeMainImage(src, index) {
    const mainImage = document.getElementById('productMainImage');
    mainImage.classList.add('fade-out');
    currentImageIndex = index;
    
    setTimeout(() => {
        mainImage.src = src;
        mainImage.classList.remove('fade-out');
        mainImage.classList.add('fade-in');
        updateThumbnails();
    }, 200);
}

// Navigate images
function navigateImages(direction) {
    if (!productImages.length) return;

    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
    } else {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    }

    changeMainImage(productImages[currentImageIndex], currentImageIndex);
}

// Update WhatsApp button
function updateWhatsAppButton(data) {
    const whatsappBtn = document.getElementById('whatsappBtn');
    const message = encodeURIComponent(`Hi, I'm interested in ${data.name} (${data.category}). Can you provide more information?`);
    whatsappBtn.href = `https://wa.me/20123456789?text=${message}`;
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const links = document.getElementById('links');
    const closeMenu = document.querySelector('.close_menu');
    
    menuToggle?.addEventListener('click', () => links.classList.add('active'));
    closeMenu?.addEventListener('click', () => links.classList.remove('active'));
}

// Header scroll effect
function initializeHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Dokunmatik cihazlar için görüntü gezinme işlevselliği
function initializeTouchNavigation() {
    const mainImage = document.getElementById('productMainImage');
    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                navigateImages('prev');
            } else {
                navigateImages('next');
            }
        }
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    initializeMobileMenu();
    initializeHeaderScroll();
    initializeTouchNavigation();
    loadProductDetails();

    // Pencere boyutu değiştiğinde görüntüleri güncelle
    window.addEventListener('resize', () => {
        const productData = document.getElementById('productName')?.dataset.productData;
        if (productData) {
            updateProductImages(JSON.parse(productData));
        }
    });
}); 