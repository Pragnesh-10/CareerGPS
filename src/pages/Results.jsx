import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRecommendations } from '../utils/recommendationEngine';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';

const Results = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        // Simulate AI processing
        const timer = setTimeout(() => {
            if (state?.formData) {
                const recs = getRecommendations(state.formData);
                setDomains(recs);
                setLoading(false);
            } else {
                // Fallback for direct access without data
                setDomains(['Data Scientist', 'Backend Developer', 'UI/UX Designer']);
                setLoading(false);
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [state]);

    const handleDomainSelect = (domain) => {
        // Navigate to Dashboard with selected domain
        // passing it in state or context (mocking persistent state)
        navigate('/dashboard', { state: { selectedDomain: domain } });
    };

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px' }}>
                    <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .loader { animation: spin 1s linear infinite; }
          `}</style>
                    <Loader size={48} className="loader" color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Analyzing your profile...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Matching your skills with 50+ career paths</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <motion.h1
                    style={{ fontSize: '2.5rem', marginBottom: '16px' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Your Perfect Career Matches
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Based on your skills, interests, and personality, these are your top domains.
                </motion.p>
            </div>

            <motion.div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.15 }}
            >
                {domains.map((domain, index) => (
                    <motion.div
                        key={domain}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                        transition={{ duration: 0.4 }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: index === 0 ? 'var(--gradient-main)' : 'var(--border-light)'
                        }}></div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', marginTop: '12px' }}>{domain}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', flex: 1 }}>
                            {domain === 'UI/UX Designer' ? 'Design intuitive interfaces and craft seamless user experiences.' :
                                domain === 'Data Scientist' ? 'Analyze complex data sets to solve business problems using ML.' :
                                    domain === 'Backend Developer' ? 'Build robust server-side applications and scalable APIs.' :
                                        'A great career path matching your logical and analytical skills.'}
                        </p>

                        <motion.button
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            onClick={() => handleDomainSelect(domain)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Start Learning Path
                        </motion.button>

                        {index === 0 && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle size={12} /> BEST MATCH
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Results;
