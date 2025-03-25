// Initialize window.ENV if it doesn't exist
window.ENV = window.ENV || {
    SUPABASE_URL: 'https://uvrozprcewgwybuhguai.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cm96cHJjZXdnd3lidWhndWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTI1MTAsImV4cCI6MjA1ODMyODUxMH0.2EgqTZjwcOv_kKP38g9nsou1ECsR_ybnAaGZduXWlaQ',
    ADMIN_USERNAME: 'İSAM ELHASAN',
    ADMIN_PASSWORD: 'İSAM552882'
};

// Use environment variables
const ENV = {
    SUPABASE_URL: window.ENV.SUPABASE_URL,
    SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY,
    ADMIN_USERNAME: window.ENV.ADMIN_USERNAME,
    ADMIN_PASSWORD: window.ENV.ADMIN_PASSWORD
};

// Make it globally accessible
window.ENV = ENV;