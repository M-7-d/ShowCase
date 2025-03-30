// Initialize Supabase client
const supabaseUrl = window.ENV.SUPABASE_URL;
const supabaseKey = window.ENV.SUPABASE_ANON_KEY;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
// Add this constant at the top of your script
const DEFAULT_IMAGE = 'https://via.placeholder.com/200x200?text=No+Image';

// Helper function to get the first image from image_urls array
function getFirstImage(imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return DEFAULT_IMAGE;
    }
    return imageUrls[0];
}

// Load products from Supabase
async function loadProducts(filters = {}, page = 1) {
    try {
        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        const tbody = document.querySelector('#products-section tbody');
        tbody.innerHTML = '';

        data.forEach(product => {
            const primaryImage = getFirstImage(product.image_urls);
            
            // Create a safe product object for JSON stringification
            const safeProduct = {
                id: product.id,
                product_id: product.product_id,
                name: product.name,
                category: product.category,
                description: product.description,
                image_urls: product.image_urls
            };

            tbody.innerHTML += `
                <tr data-product-id="${product.id}">
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${primaryImage}" class="product-image me-3" alt="Product">
                            <div>
                                <span class="fw-medium">${product.name}</span>
                                <br>
                                <small class="text-muted">ID: ${product.product_id}</small>
                            </div>
                        </div>
                    </td>
                    <td>${product.category}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                    type="button" 
                                    data-bs-toggle="dropdown">
                                Actions
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button class="dropdown-item edit-product" 
                                            data-product='${JSON.stringify(safeProduct)}'>
                                        <i class="fas fa-edit me-2"></i>Edit
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item view-images" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#viewImagesModal"
                                            data-images='${JSON.stringify(product.image_urls || [])}'>
                                        <i class="fas fa-images me-2"></i>View All Images
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item delete-product">
                                        <i class="fas fa-trash me-2"></i>Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Update product count
        document.querySelector('#products-section .text-muted').textContent = 
            `Showing ${data.length} entries`;

        addProductEventListeners();

    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error', 'Failed to load products', 'error');
    }
}

// Helper functions for status
function getStatusBadge(stock) {
    if (stock <= 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
}

function getStatusText(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
}

// Add file validation function
function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPG, JPEG or PNG image.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
}

// Add these functions to handle file uploads
async function uploadImages(files) {
    try {
        const uploadPromises = Array.from(files).map(async (file) => {
            // Validate image before upload
            validateImage(file);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            // Upload to Supabase storage
            const { data, error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
                throw error;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            console.log('Generated URL:', publicUrl); // Debug log
            return publicUrl;
        });

        const urls = await Promise.all(uploadPromises);
        console.log('Final URLs array:', urls); // Debug log
        return urls;
    } catch (error) {
        console.error('Error in uploadImages:', error);
        throw error;
    }
}

// Update the addProduct function
async function addProduct(formData) {
    try {
        const imageFiles = formData.getAll('images');
        
        const validFiles = imageFiles.filter(file => {
            if (file.size === 0) return false;
            try {
                validateImage(file);
                return true;
            } catch (error) {
                console.warn('Invalid file:', error.message);
                return false;
            }
        });
        if (validFiles.length > 0) {
            imageUrls = await uploadImages(validFiles);
        }

        // Show loading state
        const addButton = document.querySelector('#addProductBtn');
        addButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        addButton.disabled = true;

        // Create product with properly formatted image URLs array
        const { data, error } = await supabase
            .from('products')
            .insert({
                product_id: formData.get('product_id'),
                name: formData.get('name'),
                category: formData.get('category'),
                description: formData.get('description'),
                image_urls: imageUrls.length > 0 ? imageUrls : null
            })
            .select();

        if (error) {
            console.error('Insert error:', error);
            throw error;
        }

        showToast('Success', 'Product added successfully');
        loadProducts();
        
        // Reset form and previews
        document.getElementById('addProductForm').reset();
        document.querySelector('.image-previews').innerHTML = '';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();

    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Error', error.message || 'Failed to add product', 'error');
    } finally {
        // Reset button state
        const addButton = document.querySelector('#addProductBtn');
        addButton.innerHTML = '<i class="fas fa-plus me-2"></i>Add Product';
        addButton.disabled = false;
    }
}

// Edit product
async function editProduct(id, formData) {
    try {
        const { error } = await supabase
            .from('products')
            .update({
                product_id: formData.get('product_id'),
                name: formData.get('name'),
                category: formData.get('category'),
                description: formData.get('description'),
            })
            .eq('id', id);

        if (error) throw error;

        showToast('Success', 'Product updated successfully');
        loadProducts();

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();

    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error', 'Failed to update product', 'error');
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast('Success', 'Product deleted successfully');
        loadProducts(); // Reload the products table

    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error', 'Failed to delete product', 'error');
    }
}

// Add event listeners to product actions
function addProductEventListeners() {
    // Edit product
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.edit-product');
            if (!button) return;
            
            try {
                const product = JSON.parse(button.dataset.product);
                const form = document.getElementById('editProductForm');
                
                // Populate form fields
                form.querySelector('[name="id"]').value = product.id;
                form.querySelector('[name="name"]').value = product.name;
                form.querySelector('[name="category"]').value = product.category;
                form.querySelector('[name="description"]').value = product.description;

                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
                modal.show();
            } catch (error) {
                console.error('Error parsing product data:', error);
                showToast('Error', 'Failed to load product data', 'error');
            }
        });
    });

    // Delete product
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const row = e.target.closest('tr');
            const productId = row.dataset.productId;
            deleteProduct(productId);
        });
    });
}

const addProductForm = document.getElementById('addProductForm');
const addProductBtn = document.getElementById('addProductBtn');

if (addProductForm && addProductBtn) {
    // Remove any existing event listeners
    addProductForm.removeEventListener('submit', handleAddProduct);
    addProductBtn.removeEventListener('click', handleAddProduct);
    
    // Add new event listener to the button only
    addProductBtn.addEventListener('click', handleAddProduct);
}

// Add filter event listeners
document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
    loadProducts({ category: e.target.value });
});

document.getElementById('statusFilter')?.addEventListener('change', (e) => {
    loadProducts({ status: e.target.value });
});

document.getElementById('searchProducts')?.addEventListener('input', debounce((e) => {
    loadProducts({ search: e.target.value });
}, 300));

document.getElementById('resetFilters')?.addEventListener('click', () => {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('searchProducts').value = '';
    loadProducts();
});

// Utility function for debouncing search
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

// Load all data when admin dashboard is shown
function initializeAdminDashboard() {
    if (localStorage.getItem('adminAuthenticated')) {
        loadProducts();
    }
}

// Initialize dashboard when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileView();
    initializeAdminDashboard();
});

// Refresh data when switching tabs
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const section = this.getAttribute('data-section');
        if (section === 'dashboard') {
            loadDashboardStats();
            loadRecentProducts();
        } else if (section === 'products') {
            loadProducts();
        }
    });
});

// Add this function to fetch dashboard stats
async function loadDashboardStats() {
    try {
        // Get total products count
        const { data: productsCount, error: productsError } = await supabase
            .from('products')
            .select('id', { count: 'exact' });

        if (productsError) throw productsError;




        // Update dashboard stats
        document.querySelector('.stat-card.products h3').textContent = productsCount;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showToast('Error', 'Failed to load dashboard statistics', 'error');
    }
}

// Add this function to load recent products
async function loadRecentProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4);

        if (error) throw error;

        const recentProductsTable = document.querySelector('#dashboard-section .table tbody');
        recentProductsTable.innerHTML = '';

        data.forEach(product => {
            recentProductsTable.innerHTML += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${product.image_url || DEFAULT_IMAGE}" class="product-image me-3" alt="Product">
                            <span class="fw-medium">${product.name}</span>
                        </div>
                    </td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td><span class="badge bg-${getStatusBadge(product.stock)}">${getStatusText(product.stock)}</span></td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error loading recent products:', error);
        showToast('Error', 'Failed to load recent products', 'error');
    }
}

// Make updateProduct function globally available
window.updateProduct = async function() {
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    const productId = formData.get('id');

    try {
        const { error } = await supabase
            .from('products')
            .update({
                name: formData.get('name'),
                category: formData.get('category'),
                description: formData.get('description')
            })
            .eq('id', productId);

        if (error) throw error;

        showToast('Success', 'Product updated successfully');
        loadProducts();
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();

    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error', 'Failed to update product', 'error');
    }
};

// Add image preview handler
document.getElementById('productImages')?.addEventListener('change', function(e) {
    const files = e.target.files;
    console.log('Selected files:', files); // Debug log
    const previewContainer = document.querySelector('.image-previews');
    previewContainer.innerHTML = '';

    if (files) {
        Array.from(files).forEach(file => {
            try {
                validateImage(file);
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'preview-item position-relative';
                    previewDiv.style.width = '80px';
                    previewDiv.style.height = '80px';
                    
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" 
                             style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
                             alt="Preview">
                    `;
                    
                    previewContainer.appendChild(previewDiv);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                showToast('Error', error.message, 'error');
            }
        });
    }
});

// Add this event listener for viewing images
document.addEventListener('click', function(e) {
    if (e.target.closest('.view-images')) {
        const button = e.target.closest('.view-images');
        const images = JSON.parse(button.dataset.images);
        const container = document.getElementById('modalImageContainer');
        
        container.innerHTML = images.map(url => `
            <div class="col-md-4">
                <img src="${url}" 
                     class="img-fluid rounded shadow" 
                     style="width: 100%; height: 200px; object-fit: cover;"
                     alt="Product image">
            </div>
        `).join('');
    }
});

// Add this function to help debug
async function checkDatabaseState() {
    const { data, error } = await supabase
        .from('products')
        .select('*');
    
    console.log('Current database state:', data);
    console.log('Any errors:', error);
}

// Add this button to your HTML temporarily
document.querySelector('.card-body').insertAdjacentHTML('beforeend', `
    <button onclick="checkDatabaseState()" class="btn btn-secondary">
        Debug Database State
    </button>
`);

// Add this debug function
async function debugDatabaseState() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);
    
    console.log('Latest product:', data?.[0]);
    console.log('Image URLs type:', data?.[0]?.image_urls ? typeof data[0].image_urls : 'no data');
    console.log('Image URLs value:', data?.[0]?.image_urls);
    
    if (error) {
        console.error('Debug query error:', error);
    }
}

// Call this after insert to verify the data
debugDatabaseState();

// Mobil görünüm için sidebar kontrolü
function initializeMobileView() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    // Sidebar toggle butonu için event listener
    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Sidebar dışına tıklandığında kapanma
    mainContent?.addEventListener('click', () => {
        if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Ekran boyutu değiştiğinde kontrol
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
        }
    });
}

// Tablo görünümünü mobil için optimize et
function optimizeTableForMobile() {
    const tableHeaders = document.querySelectorAll('table th');
    const tableRows = document.querySelectorAll('table td');
    
    if (window.innerWidth < 768) {
        tableHeaders.forEach(th => th.style.fontSize = '0.8rem');
        tableRows.forEach(td => td.style.fontSize = '0.9rem');
    } else {
        tableHeaders.forEach(th => th.style.fontSize = '');
        tableRows.forEach(td => td.style.fontSize = '');
    }
}

// Sayfa yüklendiğinde ve ekran boyutu değiştiğinde tabloyu optimize et
window.addEventListener('load', optimizeTableForMobile);
window.addEventListener('resize', optimizeTableForMobile);

document.getElementById('editProductImages')?.addEventListener('change', function(e) {
    const files = e.target.files;
    console.log('Selected files:', files); // Debug log
    const previewContainer = document.querySelector('.edit-image-previews');
    previewContainer.innerHTML = '';

    if (files) {
        Array.from(files).forEach(file => {
            try {
                validateImage(file);
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'preview-item position-relative';
                    previewDiv.style.width = '80px';
                    previewDiv.style.height = '80px';
                    
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" 
                             style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
                             alt="Preview">
                    `;
                    
                    previewContainer.appendChild(previewDiv);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                showToast('Error', error.message, 'error');
            }
        });
    }

    const remainingImages = Array.from(document.querySelectorAll('.edit-image-previews img'))
        .map(img => img.src)
        .filter(url => url && url !== 'data:image/png;base64,...'); // Filter out placeholder images
    const finalImageUrls = [...remainingImages, ...imageUrls];
}); 