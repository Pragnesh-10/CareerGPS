import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import InterestStep from '../components/survey/InterestStep';
import WorkStyleStep from '../components/survey/WorkStyleStep';
import IntentStep from '../components/survey/IntentStep';
import ConfidenceStep from '../components/survey/ConfidenceStep';
import { useNavigate } from 'react-router-dom';

const Survey = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        interests: {},
        workStyle: {},
        intent: {},
        confidence: { math: 5, coding: 5, communication: 5 }
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const updateData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleFinish = () => {
        // Reset progress for new journey
        localStorage.removeItem('completedCourses');
        localStorage.removeItem('enrolledCourses');

        // Here we would normally call an API or process the data
        // For now, we mock valid domains based on data
        navigate('/results', { state: { formData } });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <InterestStep key="step1" data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 2:
                return <WorkStyleStep key="step2" data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <IntentStep key="step3" data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <ConfidenceStep key="step4" data={formData} updateData={updateData} onNext={handleFinish} onBack={prevStep} />;
            default:
                return null;
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            {/* Simple Progress Bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${(step / 4) * 100}%`, height: '100%', background: 'var(--gradient-main)', transition: 'width 0.3s ease' }}></div>
            </div>

            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
        </div>
    );
};

export default Survey;
