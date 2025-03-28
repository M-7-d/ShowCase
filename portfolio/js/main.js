// First declare supabase variable
let supabase;

// Initialize Supabase client
const supabaseUrl = 'https://uvrozprcewgwybuhguai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cm96cHJjZXdnd3lidWhndWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTI1MTAsImV4cCI6MjA1ODMyODUxMH0.2EgqTZjwcOv_kKP38g9nsou1ECsR_ybnAaGZduXWlaQ';
const DEFAULT_IMAGE = 'img/project1.jpg';

// Global variables for pagination
let currentPage = 1;
const productsPerPage = 9;
let allProducts = [];

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
        menuToggle.addEventListener('click', () => {
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link with smooth scroll
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
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
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
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
    currentPage = 1; // Reset to first page
    loadProducts(); // Reload products with new grid
}

// Enhanced animation on scroll with Intersection Observer
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project_box, .feature-card');
    
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
}

// Initialize all responsive functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing...');
    handleResponsive();
    setupScrollAnimations();
    initializeApp();

    // Enhanced search functionality with debounce
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentPage = 1; // Reset to first page on new search
            loadProducts(e.target.value);
        }, 300));
    }

    // Admin sayfasına yönlendirme için event listener
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin.html#login';
        });
    }
});

// Fetch and display products from Supabase with improved error handling
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
            productCards.innerHTML = '<p class="no-products">No products available at the moment.</p>';
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
            <div class="product-card" style="width: 500px;">
    <div class="product-image" style="height: 100%; width: 100%;">
        <img src="${primaryImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div class="product-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <a href="cart.html?id=${product.id}" class="view-details-btn">
                <i class="fas fa-eye"></i> <font color="white">View Details</font>
            </a>
        </div>
    </div>
    <div class="product-info">
        <span class="category"><font color="white">${product.category}</font></span>
        <h3 class="product-title"><font color="white">${product.name}</font></h3>
        <p class="product-description"><font color="white">${product.description}</font></p>
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
            productCards.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }
}

// Function to update pagination buttons
function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
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
            <i class="fas fa-chevron-right"></i>
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

// Handle contact form submission with improved error handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {  // Only add event listener if form exists
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!supabase) {
            console.error('Supabase client not initialized');
            alert('System error. Please try again later.');
            return;
        }

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');

        // Disable submit button to prevent double submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = {
            full_name: form.fullName.value,
            email: form.email.value,
            mobile: form.mobile.value,
            subject: form.subject.value,
            message: form.message.value,
            created_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([formData]);

            if (error) throw error;

            alert('Message sent successfully!');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error.message);
            alert('There was an error submitting your message. Please try again.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// Helper function to get first image
function getFirstImage(imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return DEFAULT_IMAGE;
    }
    return imageUrls[0];
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

// Add debounce function if not already present
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
