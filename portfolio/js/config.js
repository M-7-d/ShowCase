// Use environment variables loaded by env.js
const ENV = {
    SUPABASE_URL: window.ENV.SUPABASE_URL,
    SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY,
    ADMIN_USERNAME: window.ENV.ADMIN_USERNAME,
    ADMIN_PASSWORD: window.ENV.ADMIN_PASSWORD
};

// Make it globally accessible
window.ENV = ENV;