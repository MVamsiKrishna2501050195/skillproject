import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiCompass, FiPlusCircle, FiUsers, FiLogOut, FiAward } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';

export default function Sidebar() {
    const { user, logout, isInstructor } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentLinks = [
        { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { to: '/courses', icon: <FiCompass />, label: 'Browse Courses' },
        { to: '/my-courses', icon: <FiBook />, label: 'My Courses' },
    ];

    const instructorLinks = [
        { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { to: '/courses', icon: <FiCompass />, label: 'All Courses' },
        { to: '/my-courses', icon: <FiBook />, label: 'My Courses' },
        { to: '/create-course', icon: <FiPlusCircle />, label: 'Create Course' },
    ];

    const links = isInstructor ? instructorLinks : studentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon"><LuGraduationCap /></div>
                    <h1>LearnHub</h1>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.name}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            </div>
        </aside>
    );
}
