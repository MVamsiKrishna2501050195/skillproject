import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../api/services';

export default function CreateCourse() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        thumbnail: '',
    });
    const [loading, setLoading] = useState(false);

    const categories = ['Programming', 'Web Development', 'Data Science', 'Backend', 'DevOps', 'Design', 'Mobile', 'AI/ML'];

    const thumbnails = [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await courseAPI.create(form, user.id);
            navigate(`/courses/${res.data.id}`);
        } catch (err) {
            alert('Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '700px' }}>
            <div className="page-header">
                <h2>Create New Course</h2>
                <p>Fill in the details to create your course</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Course Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Complete Java Masterclass"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            className="form-control"
                            placeholder="Describe what students will learn in this course..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="form-control"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Thumbnail</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                            {thumbnails.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    alt={`Thumb ${i}`}
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        border: form.thumbnail === url ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                        opacity: form.thumbnail === url ? 1 : 0.7,
                                        transition: 'var(--transition-fast)',
                                    }}
                                    onClick={() => setForm({ ...form, thumbnail: url })}
                                />
                            ))}
                        </div>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="Or paste a custom thumbnail URL"
                            value={form.thumbnail}
                            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
