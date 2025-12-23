import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import BackgroundGlow from '../components/common/BackgroundGlow';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="container welcome-container">

      {/* Background Glow */}
      <BackgroundGlow />

      <div className="welcome-badge">
        <Sparkles size={16} color="#ec4899" />
        <span>AI-Powered Career Guidance</span>
      </div>

      <h1 className="welcome-title">
        Discover Your <br />
        <span className="gradient-text">True Potential</span>
      </h1>

      <p className="welcome-description">
        Stop guessing your future. Let our AI analyze your skills, interests, and personality to build a personalized career roadmap for you.
      </p>

      <button onClick={() => navigate('/survey')} className="btn-primary welcome-cta">
        Start Your Journey <ArrowRight size={20} />
      </button>

      <div className="welcome-stats">
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
      </div>
    </div>
  );
};

export default Welcome;
