import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/services';
import { LuGraduationCap } from 'react-icons/lu';
import { FiBook, FiUser } from 'react-icons/fi';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authAPI.register({ name, email, password, role });
            if (res.data.error) {
                setError(res.data.error);
            } else {
                login(res.data);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container fade-in">
                <div className="auth-header">
                    <div className="auth-logo"><LuGraduationCap /></div>
                    <h1>Join LearnHub</h1>
                    <p>Create your account and start learning</p>
                </div>

                <div className="auth-card">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-option ${role === 'STUDENT' ? 'active' : ''}`}
                            onClick={() => setRole('STUDENT')}
                        >
                            <div className="role-icon"><FiBook /></div>
                            <div className="role-name">Student</div>
                        </button>
                        <button
                            type="button"
                            className={`role-option ${role === 'INSTRUCTOR' ? 'active' : ''}`}
                            onClick={() => setRole('INSTRUCTOR')}
                        >
                            <div className="role-icon"><FiUser /></div>
                            <div className="role-name">Instructor</div>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
