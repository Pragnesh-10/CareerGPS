
import React from 'react';

const BackgroundGlow = ({ width = '600px', height = '600px', top = '20%', left = '50%', color = 'rgba(99, 102, 241, 0.15)' }) => {
    return (
        <div style={{
            position: 'absolute',
            top: top,
            left: left,
            transform: 'translate(-50%, -50%)',
            width: width,
            height: height,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, rgba(10, 10, 15, 0) 70%)`,
            zIndex: -1,
            pointerEvents: 'none'
        }}></div>
    );
};

export default BackgroundGlow;
