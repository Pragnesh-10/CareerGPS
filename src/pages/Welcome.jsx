import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import BackgroundGlow from '../components/common/BackgroundGlow';
import './Welcome.css';

import VisitorCounter from '../components/common/VisitorCounter';

const Welcome = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="container welcome-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background Glow */}
        <BackgroundGlow />

        <motion.div
          className="welcome-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="welcome-badge" variants={itemVariants}>
            <Sparkles size={16} color="#ec4899" />
            <span className="welcome-badge-text">AI-Powered Career Guidance</span>
          </motion.div>

          <motion.h1 className="welcome-title" variants={itemVariants}>
            Discover Your <br />
            <span className="gradient-text">True Potential</span>
          </motion.h1>

          <motion.p className="welcome-description" variants={itemVariants}>
            Stop guessing your future. Let our AI analyze your skills, interests, and personality to build a personalized career roadmap for you.
          </motion.p>

          <motion.button
            className="btn-primary welcome-cta"
            onClick={() => {
              // Always start fresh when clicking "Start Your Journey"
              localStorage.removeItem('formData');
              localStorage.removeItem('completedCourses');
              localStorage.removeItem('enrolledCourses');
              navigate('/survey');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            Start Your Journey <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        <motion.div
          className="welcome-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="stat-item">
            <h3>50+</h3>
            <p>Career Paths</p>
          </div>
          <div className="stat-item">
            <h3>10k+</h3>
            <p>Learning Resources</p>
          </div>
          <div className="stat-item">
            <h3>Verified</h3>
            <p>Expert Network</p>
          </div>
        </motion.div>
      </div>

      <VisitorCounter />
    </div >
  );
};

export default Welcome;
