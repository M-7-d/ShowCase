// Use environment variables loaded by env.js
const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL || window.ENV.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || window.ENV.SUPABASE_ANON_KEY,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || window.ENV.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || window.ENV.ADMIN_PASSWORD
};

// Global olarak erişilebilir yapma
window.ENV = ENV;