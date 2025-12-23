import React, { useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { motion } from 'framer-motion';

const Progress = () => {
    const [stats, setStats] = useState({
        completionRate: 0,
        enrolledCount: 0,
        completedCount: 0,
        hoursLearning: 0
    });

    useEffect(() => {
        // Flatten all courses to get a master list
        const allCourses = [];
        Object.values(courses).forEach(domain => {
            if (domain.beginner) allCourses.push(...domain.beginner);
            if (domain.intermediate) allCourses.push(...domain.intermediate);
            if (domain.advanced) allCourses.push(...domain.advanced);
        });

        // Deduplicate courses based on title (handling the default fallback structure if needed)
        // Actually, let's just use the selected domain's courses if possible, 
        // BUT the Dashboard completion logic seemed to use ALL courses from the selected domain.
        // However, the dashboard logic flatly used 'Data Scientist' or 'default'. 
        // To be consistent with Dashboard's global progress bar, we should probably stick to 
        // logic similar to what the Dashboard uses, OR try to be smarter.
        // The Dashboard uses `location.state?.selectedDomain` but defaults to 'Data Scientist'.
        // Since Progress page might not have that state passed, we might need to read it or just show GLOBAL progress?
        // The user's request implies "progress bar in menu", suggesting a global view.
        // Let's assume global progress for simplicty, or try to retrieve stored domain.

        // For now, let's calculate based on ALL courses found in the `courses` object 
        // OR better, let's stick to the 'Data Scientist' default if no other info, 
        // matching the Dashboard's default.
        // Ideally, we should save the selected domain in localStorage too!

        // Let's try to get ALL unique courses across all domains to be safe, 
        // or just use the same default 'Data Scientist' as the dashboard for now.
        // Use 'Data Scientist' default logic for now
        const domainCourses = courses['Data Scientist'];
        const targetCourses = [
            ...domainCourses.beginner,
            ...domainCourses.intermediate,
            ...domainCourses.advanced
        ];

        const courseMap = {};
        targetCourses.forEach(c => courseMap[c.title] = c);

        const savedCompleted = localStorage.getItem('completedCourses');
        const completedSet = savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set();

        const savedEnrolled = localStorage.getItem('enrolledCourses');
        const enrolledSet = savedEnrolled ? new Set(JSON.parse(savedEnrolled)) : new Set();

        // Calculate Stats
        const completedCount = completedSet.size;
        const enrolledCount = enrolledSet.size; // This tracks courses started

        // Completion Rate
        const completionRate = Math.round((completedCount / targetCourses.length) * 100) || 0;

        // Hours Learning (sum duration of ENROLLED or COMPLETED? Usually completed + in-progress part, 
        // but let's sum duration of all ENROLLED courses to show "planned" or "active" learning hours)
        let totalHours = 0;
        enrolledSet.forEach(title => {
            const course = courseMap[title];
            if (course && course.duration) {
                const hours = parseInt(course.duration.replace(/\D/g, ''), 10) || 0;
                totalHours += hours;
            }
        });

        setStats({
            completionRate,
            enrolledCount,
            completedCount,
            hoursLearning: totalHours
        });

    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div style={{ marginBottom: '40px' }}>
                <motion.h1
                    style={{ fontSize: '2.5rem' }}
                    variants={itemVariants}
                >
                    Your Progress
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)' }}
                    variants={itemVariants}
                >
                    Track your journey towards your dream career.
                </motion.p>
            </div>

            <motion.div
                className="card"
                style={{ marginBottom: '24px' }}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Domain Readiness</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{stats.completionRate}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                        style={{ width: `${stats.completionRate}%`, height: '100%', background: 'var(--gradient-main)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.completionRate}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{stats.enrolledCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Courses Enrolled</p>
                </motion.div>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{stats.completedCount}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Courses Completed</p>
                </motion.div>
                <motion.div
                    className="card"
                    style={{ textAlign: 'center', padding: '32px' }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>{stats.hoursLearning}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Hours Learning</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Progress;
