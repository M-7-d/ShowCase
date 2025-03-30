// Initialize window.ENV if it doesn't exist
window.ENV = window.ENV || {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    ADMIN_USERNAME: '',
    ADMIN_PASSWORD: ''
};

// Load environment variables from a global config object
const ENV = {
    SUPABASE_URL: window.ENV.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY || '',
    ADMIN_USERNAME: window.ENV.ADMIN_USERNAME || '',
    ADMIN_PASSWORD: window.ENV.ADMIN_PASSWORD || ''
};

// Make it globally accessible
window.ENV = ENV;