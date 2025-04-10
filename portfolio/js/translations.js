// Shared translations for all pages
const translations = {
    en: {
        // Navigation
        home: "Home",
        products: "Products",
        include: "Include",
        admin: "Admin",
        searchProducts: "Search products...",
        viewDetails: "View Details",
        noProducts: "No products available at the moment.",
        loading: "Loading products...",
        error: "Failed to load products. Please try again later.",
        
        // Hero Section
        welcome: "Welcome to",
        heroText: "📣 We proudly offer the finest PVC and aluminum parts and accessories! Whether you're looking for high quality, we're here to provide everything you need.",
        ourProducts: "Our Products",
        
        // Products Section
        featuredProducts: "Our Featured Products",
        exploreProducts: "Explore our high-quality selection of PVC and aluminum parts",
        productsInclude: "Our products include:",
        highQualityPVC: "High-quality PVC parts",
        durableAluminum: "Durable aluminum parts",
        accessories: "A wide range of accessories",
        
        // Why Choose Us
        whyChooseUs: "Why choose Stones?",
        quality: "Unparalleled quality",
        qualityDesc: "Our products undergo rigorous quality control to ensure they meet the highest standards.",
        prices: "Competitive prices",
        pricesDesc: "We offer the best value for your investment without compromising on quality.",
        service: "Excellent customer service",
        serviceDesc: "Our dedicated team is always ready to assist you with any inquiries or support needs.",
        
        // Footer
        copyright: "All Rights Reserved.",
        
        // Cart Page
        shoppingCart: "Shopping Cart",
        cartEmpty: "Your cart is empty",
        continueShopping: "Continue Shopping",
        checkout: "Checkout",
        total: "Total",
        remove: "Remove",
        quantity: "Quantity",
        productId: "Product ID:",
        contactWhatsapp: "Contact on WhatsApp",
        whatsappMessage: "Hi, I'm interested in",
        noProductFound: "Product not found",
        loadingError: "Error loading product details",
        systemError: "System error. Please try again later.",
        sending: "Sending...",
        messageSent: "Message sent successfully!",
        submitError: "There was an error submitting your message. Please try again.",
        send: "Send Message",
        
        // Admin Page
        login: "Login",
        username: "Username",
        password: "Password",
        loginButton: "Login",
        addProduct: "Add Product",
        editProduct: "Edit Product",
        deleteProduct: "Delete Product",
        productName: "Product Name",
        productDescription: "Product Description",
        productCategory: "Product Category",
        productPrice: "Product Price",
        productImages: "Product Images",
        save: "Save",
        cancel: "Cancel",
        success: "Success",
        error: "Error",
        loading: "Loading...",
        confirmDelete: "Are you sure you want to delete this product?",
        yes: "Yes",
        no: "No"
    },
    ar: {
        // Navigation
        home: "الرئيسية",
        products: "المنتجات",
        include: "يشمل",
        admin: "المدير",
        searchProducts: "البحث عن المنتجات...",
        viewDetails: "عرض التفاصيل",
        noProducts: "لا توجد منتجات متاحة حالياً.",
        loading: "جاري تحميل المنتجات...",
        error: "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.",
        
        // Hero Section
        welcome: "مرحباً بكم في",
        heroText: "📣 نقدم بفخر أفضل أجزاء PVC والألمنيوم وملحقاتها! سواء كنت تبحث عن جودة عالية، نحن هنا لتوفير كل ما تحتاجه.",
        ourProducts: "منتجاتنا",
        
        // Products Section
        featuredProducts: "منتجاتنا المميزة",
        exploreProducts: "اكتشف مجموعتنا عالية الجودة من أجزاء PVC والألمنيوم",
        productsInclude: "تشمل منتجاتنا:",
        highQualityPVC: "أجزاء PVC عالية الجودة",
        durableAluminum: "أجزاء ألمنيوم متينة",
        accessories: "مجموعة واسعة من الملحقات",
        
        // Why Choose Us
        whyChooseUs: "لماذا تختار Stones؟",
        quality: "جودة لا مثيل لها",
        qualityDesc: "تخضع منتجاتنا لمراقبة جودة صارمة لضمان تلبية أعلى المعايير.",
        prices: "أسعار تنافسية",
        pricesDesc: "نقدم أفضل قيمة لاستثمارك دون المساس بالجودة.",
        service: "خدمة عملاء ممتازة",
        serviceDesc: "فريقنا المخصص جاهز دائماً لمساعدتك في أي استفسارات أو احتياجات دعم.",
        
        // Footer
        copyright: "جميع الحقوق محفوظة.",
        
        // Cart Page
        shoppingCart: "سلة التسوق",
        cartEmpty: "سلة التسوق فارغة",
        continueShopping: "متابعة التسوق",
        checkout: "إتمام الشراء",
        total: "المجموع",
        remove: "إزالة",
        quantity: "الكمية",
        productId: "معرف المنتج:",
        contactWhatsapp: "تواصل عبر واتساب",
        whatsappMessage: "مرحباً، أنا مهتم بـ",
        noProductFound: "المنتج غير موجود",
        loadingError: "خطأ في تحميل تفاصيل المنتج",
        systemError: "خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.",
        sending: "جاري الإرسال...",
        messageSent: "تم إرسال الرسالة بنجاح!",
        submitError: "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.",
        send: "إرسال الرسالة",
        
        // Admin Page
        login: "تسجيل الدخول",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        loginButton: "دخول",
        addProduct: "إضافة منتج",
        editProduct: "تعديل المنتج",
        deleteProduct: "حذف المنتج",
        productName: "اسم المنتج",
        productDescription: "وصف المنتج",
        productCategory: "فئة المنتج",
        productPrice: "سعر المنتج",
        productImages: "صور المنتج",
        save: "حفظ",
        cancel: "إلغاء",
        success: "نجاح",
        error: "خطأ",
        loading: "جاري التحميل...",
        confirmDelete: "هل أنت متأكد من حذف هذا المنتج؟",
        yes: "نعم",
        no: "لا"
    },
    tr: {
        // Navigation
        home: "Ana Sayfa",
        products: "Ürünler",
        include: "İçerir",
        admin: "Yönetici",
        searchProducts: "Ürün ara...",
        viewDetails: "Detayları Gör",
        noProducts: "Şu anda mevcut ürün bulunmamaktadır.",
        loading: "Ürünler yükleniyor...",
        error: "Ürünler yüklenemedi. Lütfen daha sonra tekrar deneyin.",
        
        // Hero Section
        welcome: "Hoş Geldiniz",
        heroText: "📣 En kaliteli PVC ve alüminyum parçaları ve aksesuarları gururla sunuyoruz! Yüksek kalite arıyorsanız, ihtiyacınız olan her şeyi sağlamak için buradayız.",
        ourProducts: "Ürünlerimiz",
        
        // Products Section
        featuredProducts: "Öne Çıkan Ürünlerimiz",
        exploreProducts: "Yüksek kaliteli PVC ve alüminyum parça seçimimizi keşfedin",
        productsInclude: "Ürünlerimiz şunları içerir:",
        highQualityPVC: "Yüksek kaliteli PVC parçalar",
        durableAluminum: "Dayanıklı alüminyum parçalar",
        accessories: "Geniş aksesuar yelpazesi",
        
        // Why Choose Us
        whyChooseUs: "Neden Stones'u Seçmelisiniz?",
        quality: "Emsalsiz kalite",
        qualityDesc: "Ürünlerimiz en yüksek standartları karşılamak için sıkı kalite kontrolünden geçer.",
        prices: "Rekabetçi fiyatlar",
        pricesDesc: "Kaliteden ödün vermeden en iyi değeri sunuyoruz.",
        service: "Mükemmel müşteri hizmeti",
        serviceDesc: "Özel ekibimiz her türlü soru ve destek ihtiyacınız için her zaman hazırdır.",
        
        // Footer
        copyright: "Tüm Hakları Saklıdır.",
        
        // Cart Page
        shoppingCart: "Alışveriş Sepeti",
        cartEmpty: "Sepetiniz boş",
        continueShopping: "Alışverişe Devam Et",
        checkout: "Ödeme",
        total: "Toplam",
        remove: "Kaldır",
        quantity: "Miktar",
        productId: "Ürün ID:",
        contactWhatsapp: "WhatsApp'tan İletişime Geç",
        whatsappMessage: "Merhaba, ilgilendiğim ürün",
        noProductFound: "Ürün bulunamadı",
        loadingError: "Ürün detayları yüklenirken hata oluştu",
        systemError: "Sistem hatası. Lütfen daha sonra tekrar deneyin.",
        sending: "Gönderiliyor...",
        messageSent: "Mesaj başarıyla gönderildi!",
        submitError: "Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        send: "Mesaj Gönder",
        
        // Admin Page
        login: "Giriş",
        username: "Kullanıcı Adı",
        password: "Şifre",
        loginButton: "Giriş Yap",
        addProduct: "Ürün Ekle",
        editProduct: "Ürün Düzenle",
        deleteProduct: "Ürün Sil",
        productName: "Ürün Adı",
        productDescription: "Ürün Açıklaması",
        productCategory: "Ürün Kategorisi",
        productPrice: "Ürün Fiyatı",
        productImages: "Ürün Görselleri",
        save: "Kaydet",
        cancel: "İptal",
        success: "Başarılı",
        error: "Hata",
        loading: "Yükleniyor...",
        confirmDelete: "Bu ürünü silmek istediğinizden emin misiniz?",
        yes: "Evet",
        no: "Hayır"
    }
};

// Language management functions
function getCurrentLang() {
    const lang = localStorage.getItem('language');
    // Ensure we always return a valid language code
    return (lang && (lang === 'en' || lang === 'ar' || lang === 'tr')) ? lang : 'en';
}

function setCurrentLang(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Set RTL direction for Arabic
    const isRTL = lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add specific classes for RTL support
    if (isRTL) {
        document.body.classList.add('rtl');
        adjustRTLStyles();
    } else {
        document.body.classList.remove('rtl');
        resetRTLStyles();
    }
}

// Helper function to adjust styles for RTL layout
function adjustRTLStyles() {
    // Fix search input for RTL
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.style.textAlign = 'right';
        searchInput.style.paddingRight = '15px';
    }
    
    // Fix mobile menu for RTL
    const navLinks = document.getElementById('links');
    if (navLinks) {
        navLinks.style.left = 'auto';
        navLinks.style.right = '-100%';
    }
    
    // Add any other RTL-specific adjustments
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Mobile-specific RTL adjustments
        const menuItems = document.querySelectorAll('.links a');
        menuItems.forEach(item => {
            item.style.width = '100%';
            item.style.textAlign = 'right';
        });
    }
}

// Helper function to reset RTL styles
function resetRTLStyles() {
    // Reset search input
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.style.textAlign = '';
        searchInput.style.paddingRight = '';
    }
    
    // Reset mobile menu
    const navLinks = document.getElementById('links');
    if (navLinks) {
        navLinks.style.left = '';
        navLinks.style.right = '';
    }
    
    // Reset any other styles modified for RTL
    const menuItems = document.querySelectorAll('.links a');
    menuItems.forEach(item => {
        item.style.width = '';
        item.style.textAlign = '';
    });
}

function getTranslation(key) {
    const currentLang = getCurrentLang();
    const langTranslations = translations[currentLang];
    
    if (!langTranslations) {
        console.warn(`Language ${currentLang} not found, falling back to English`);
        return translations.en[key] || key;
    }
    
    return langTranslations[key] || translations.en[key] || key;
}

// Export for use in other files
window.translations = translations;
window.getCurrentLang = getCurrentLang;
window.setCurrentLang = setCurrentLang;
window.getTranslation = getTranslation;
window.adjustRTLStyles = adjustRTLStyles;
window.resetRTLStyles = resetRTLStyles;

// Listen for window resize to adjust RTL styles if needed
window.addEventListener('resize', () => {
    if (document.documentElement.dir === 'rtl') {
        adjustRTLStyles();
    }
}); 