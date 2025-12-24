import { useNavigate, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VisitorCounter from '../components/common/VisitorCounter';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <div style={{ padding: '20px 0 0 20px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem',
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-muted)';
                    }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
            </div>
            {/* Main Content */}
            <main className="main-content" style={{ marginTop: '0', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)' }}>
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
                <VisitorCounter />
            </main>
        </div>
    );
};

export default DashboardLayout;
