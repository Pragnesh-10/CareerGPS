
import React from 'react';
import './MenuItem.css';

const MenuItem = ({ icon: Icon, label, onClick, danger }) => (
    <button
        onClick={onClick}
        className={`menu-item ${danger ? 'menu-item-danger' : ''}`}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default MenuItem;
