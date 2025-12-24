import { useState, useEffect } from 'react';

const VisitorCounter = () => {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            const base = import.meta.env.VITE_ML_API_BASE || 'http://localhost:8000';
            try {
                const res = await fetch(`${base}/visitor-count`);
                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count);
                }
            } catch (err) {
                console.warn('Failed to fetch visitor count:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []);

    if (loading || count === null) return null;

    return (
        <div style={{
            textAlign: 'center',
            padding: '10px',
            marginTop: '20px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            Total Visitors: {count.toLocaleString()}
        </div>
    );
};

export default VisitorCounter;
