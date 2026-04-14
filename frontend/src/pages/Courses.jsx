import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../api/services';
import { FiSearch, FiUser, FiBook, FiUsers } from 'react-icons/fi';

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        courseAPI.getAll()
            .then(res => setCourses(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.category || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>Course Catalog</h2>
                <p>Explore our wide range of courses</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses by title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><FiSearch /></div>
                    <h3>No courses found</h3>
                    <p>Try adjusting your search</p>
                </div>
            ) : (
                <div className="course-grid">
                    {filtered.map(course => (
                        <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
                            <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={course.title} className="thumbnail" />
                            <div className="course-body">
                                <span className="course-category">{course.category || 'General'}</span>
                                <h3>{course.title}</h3>
                                <p className="course-desc">{course.description}</p>
                                <div className="course-meta">
                                    <span><FiUser /> {course.instructorName}</span>
                                    <span><FiBook /> {course.lessonCount} lessons</span>
                                    <span><FiUsers /> {course.enrollmentCount}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
