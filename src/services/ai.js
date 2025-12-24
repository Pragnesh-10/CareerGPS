// Simplified AI service - Local Logic Only

export const generateAIResponse = async (prompt, provider = 'local') => {
    // Mock response to simulate AI processing without external calls
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
        return "Hello! I'm your offline Career Assistant. How can I help you navigate your career path today?";
    }
    if (lowerPrompt.includes('python')) {
        return "Python is a fantastic language for Data Science, Backend Development, and AI. I recommend starting with the 'Python for Everybody' course listed in your dashboard.";
    }
    if (lowerPrompt.includes('recommend') || lowerPrompt.includes('career')) {
        return "I can help you find the right career path. Have you taken our skills survey yet? That's the best way to get personalized recommendations.";
    }
    if (lowerPrompt.includes('job') || lowerPrompt.includes('interview')) {
        return "For interview prep, I suggest focusing on Data Structures & Algorithms. We also have expert mentors available to conduct mock interviews!";
    }

    return "I'm currently running in offline mode to protect your privacy. Use the Dashboard to explore courses, or the 'Experts' tab to connect with a human mentor!";
};

// Call the server-side ML inference API. Falls back to local rule-based engine if the API is unreachable.
export const getCareerRecommendations = async (formData) => {
    // 1. Try Python ML API (if running)
    const base = import.meta.env.VITE_ML_API_BASE || 'http://localhost:8000';
    try {
        const res = await fetch(`${base}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Inference API returned ' + res.status);
        const json = await res.json();
        return json.predictions; // [{ career, prob }, ...]
    } catch (err) {
        console.warn('ML API failed, falling back to local engine:', err.message);

        // 2. Fallback to Local Vector Space Model (VSM)
        const { getRecommendations } = await import('../utils/recommendationEngine');
        return getRecommendations(formData);
    }
};
