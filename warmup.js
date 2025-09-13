// Simple warmup script to keep Render service alive
// Run this periodically to prevent cold starts

const API_URL = 'https://portfolio-backend-skva.onrender.com/api/health';

async function warmup() {
    try {
        const startTime = Date.now();
        const response = await fetch(API_URL);
        const endTime = Date.now();
        
        console.log(`Warmup: ${response.status} in ${endTime - startTime}ms`);
        
        if (response.status !== 200) {
            console.warn('Service may be having issues');
        }
    } catch (error) {
        console.error('Warmup failed:', error.message);
    }
}

// Run warmup every 10 minutes to keep service alive
setInterval(warmup, 10 * 60 * 1000);

// Run initial warmup
warmup();