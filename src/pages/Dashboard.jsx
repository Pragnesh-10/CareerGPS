import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { courses } from '../data/courses';
import { PlayCircle, Clock, Star, CheckCircle, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const CourseCard = ({ course, isCompleted, onToggle, onStart }) => (
    <motion.div
        className="card"
        style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: isCompleted ? '1px solid var(--accent)' : 'none' }}
        variants={cardVariants}
        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
        transition={{ type: "spring", stiffness: 300 }}
    >
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

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <motion.button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}
                onClick={() => {
                    onStart(course.title);
                    window.open(course.link, '_blank');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Start Course
            </motion.button>
            <motion.button
                className="btn-secondary"
                style={{
                    padding: '8px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: isCompleted ? '#22c55e' : 'inherit',
                    border: isCompleted ? '1px solid #22c55e' : '1px solid transparent'
                }}
                onClick={onToggle}
                title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
            >
                {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
            </motion.button>
        </div>
    </motion.div>
);

const Section = ({ title, items, completedSet, onToggle, onStart }) => (
    <motion.div
        style={{ marginBottom: '40px' }}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.h3
            style={{ fontSize: '1.5rem', marginBottom: '20px', borderLeft: '4px solid var(--primary)', paddingLeft: '12px' }}
            variants={cardVariants}
        >
            {title}
        </motion.h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {items.map((item, idx) => (
                <CourseCard
                    key={idx}
                    course={item}
                    isCompleted={completedSet.has(item.title)}
                    onToggle={() => onToggle(item.title)}
                    onStart={onStart}
                />
            ))}
        </div>
    </motion.div>
);

const EnrolledModal = ({ isOpen, onClose, enrolledCourses, completedCourses, allCoursesMap }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        style={{
                            background: 'var(--card-bg)', padding: '30px', borderRadius: '12px',
                            width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', border: '1px solid var(--border)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Enrolled Courses</h2>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {enrolledCourses.size === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>You haven't started any courses yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {Array.from(enrolledCourses).map(title => {
                                    const course = allCoursesMap[title];
                                    if (!course) return null;
                                    const isCompleted = completedCourses.has(title);
                                    return (
                                        <motion.div
                                            key={title}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{
                                                padding: '15px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{course.title}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.platform}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {isCompleted ? (
                                                    <span style={{ color: '#22c55e', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <CheckCircle size={14} /> Completed
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#fbbf24', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <PlayCircle size={14} /> In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Dashboard = () => {
    const location = useLocation();
    const selectedDomain = location.state?.selectedDomain || 'Data Scientist'; // Fallback

    const domainCourses = courses[selectedDomain] || courses['default'];

    // Flatten all courses into a single list for easy counting
    const allCourses = [
        ...domainCourses.beginner,
        ...domainCourses.intermediate,
        ...domainCourses.advanced
    ];

    // Map for easy lookup by title
    const allCoursesMap = allCourses.reduce((acc, course) => {
        acc[course.title] = course;
        return acc;
    }, {});

    // State for completed courses
    const [completedCourses, setCompletedCourses] = useState(() => {
        const saved = localStorage.getItem('completedCourses');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // State for enrolled courses
    const [enrolledCourses, setEnrolledCourses] = useState(() => {
        const saved = localStorage.getItem('enrolledCourses');
        // Initialize with completed courses as they are implicitly enrolled
        const initial = saved ? new Set(JSON.parse(saved)) : new Set();
        return initial;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('completedCourses', JSON.stringify([...completedCourses]));
    }, [completedCourses]);

    useEffect(() => {
        // Ensure completed courses are always in enrolled
        const updatedEnrolled = new Set([...enrolledCourses, ...completedCourses]);
        // Only update if size changed to avoid loops (though Set logic handles this mostly)
        if (updatedEnrolled.size !== enrolledCourses.size) {
            setEnrolledCourses(updatedEnrolled);
        }
        localStorage.setItem('enrolledCourses', JSON.stringify([...updatedEnrolled]));
    }, [enrolledCourses, completedCourses]);

    const toggleCourse = (title) => {
        setCompletedCourses(prev => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    const startCourse = (title) => {
        setEnrolledCourses(prev => {
            const next = new Set(prev);
            next.add(title);
            return next;
        });
    };

    const progress = Math.round((completedCourses.size / allCourses.length) * 100) || 0;

    return (
        <motion.div
            className="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ marginBottom: '40px' }}>
                <motion.h1
                    style={{ fontSize: '2.5rem' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Your Learning Path: <span className="gradient-text">{selectedDomain}</span>
                </motion.h1>
                <motion.p
                    style={{ color: 'var(--text-muted)', marginBottom: '20px' }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Curated courses to take you from Beginner to Expert.
                </motion.p>

                {/* Stats & Progress */}
                <motion.div
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                        <div>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{progress}%</span>
                            <span style={{ marginLeft: '10px', color: 'var(--text-muted)' }}>Completion Rate</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', marginBottom: '4px', display: 'block' }}
                            >
                                {enrolledCourses.size} Courses Enrolled
                            </button>
                            <span style={{ color: 'var(--text)' }}>
                                <span style={{ color: '#22c55e' }}>{completedCourses.size}</span> / {allCourses.length} Completed
                            </span>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                        <motion.div
                            style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            </div>

            <Section title="Beginner" items={domainCourses.beginner} completedSet={completedCourses} onToggle={toggleCourse} onStart={startCourse} />
            <Section title="Intermediate" items={domainCourses.intermediate} completedSet={completedCourses} onToggle={toggleCourse} onStart={startCourse} />
            <Section title="Advanced" items={domainCourses.advanced} completedSet={completedCourses} onToggle={toggleCourse} onStart={startCourse} />

            <EnrolledModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enrolledCourses={enrolledCourses}
                completedCourses={completedCourses}
                allCoursesMap={allCoursesMap}
            />
        </motion.div >
    );
};

export default Dashboard;
