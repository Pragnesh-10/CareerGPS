
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, TrendingUp, Users, CreditCard, Share2 } from 'lucide-react';
import MenuItem from './MenuItem';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleMenuClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleReferral = () => {
        alert('Referral link copied to clipboard!');
    };

    if (location.pathname === '/' || location.pathname === '/survey') {
        return null;
    }

    return (
        <header className="global-header">
            <div className="container header-container">
                <div
                    onClick={() => navigate('/')}
                    className="logo-container"
                >
                    <span className="logo-dot"></span>
                    CareerAI
                </div>

                <div className="header-right">
                    <nav className="nav-links">
                        <Link to="/experts" className={`nav-link ${location.pathname === '/experts' ? 'active' : ''}`}>
                            Experts
                        </Link>
                        <button onClick={handleReferral} className="nav-link">
                            Refer Friends
                        </button>
                    </nav>

                    <div className="user-menu-wrapper">
                        <button
                            onClick={toggleMenu}
                            className="user-menu-btn"
                        >
                            <User size={20} />
                        </button>

                        {menuOpen && (
                            <div className="user-dropdown">
                                <MenuItem icon={Users} label="Experts" onClick={() => handleMenuClick('/experts')} />
                                <MenuItem icon={CreditCard} label="Subscription" onClick={() => handleMenuClick('/subscription')} />
                                <MenuItem icon={Share2} label="Refer Now" onClick={handleReferral} />
                                <div className="dropdown-separator"></div>
                                <MenuItem icon={LogOut} label="Log Out" onClick={() => navigate('/')} danger />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
