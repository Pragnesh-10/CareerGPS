import React from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../data/courses';
import { PlayCircle, Clock, Star } from 'lucide-react';

const CourseCard = ({ course }) => (
    <div className="card" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{course.title}</h4>
            <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                {course.platform}
            </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {course.duration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#fbbf24" fill="#fbbf24" /> {course.rating}</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Outcome: {course.outcome}</p>

        <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.9rem', alignSelf: 'flex-start', marginTop: 'auto' }}
            onClick={() => window.open(course.link, '_blank')}
        >
            Start Course
        </button>
    </div>
);

const Section = ({ title, items }) => (
    <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {items.map((item, idx) => <CourseCard key={idx} course={item} />)}
        </div>
    </div>
);

const Dashboard = () => {
    const location = useLocation();
    const selectedDomain = location.state?.selectedDomain || 'Data Scientist'; // Fallback

    const domainCourses = courses[selectedDomain] || courses['default'];

    return (
        <div className="container">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Your Learning Path: <span className="gradient-text">{selectedDomain}</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Curated courses to take you from Beginner to Expert.</p>
            </div>

            <Section title="Beginner" items={domainCourses.beginner} />
            <Section title="Intermediate" items={domainCourses.intermediate} />
            <Section title="Advanced" items={domainCourses.advanced} />
        </div>
    );
};

export default Dashboard;
