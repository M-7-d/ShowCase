// Load environment variables
async function loadEnv() {
    try {
        const response = await fetch('/portfolio/.env');
        const text = await response.text();
        
        // Parse .env file
        const env = {};
        text.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.join('=').trim();
            }
        });
        
        return env;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}

// Export the env object
window.ENV = {};
loadEnv().then(env => {
    window.ENV = env;
}); 