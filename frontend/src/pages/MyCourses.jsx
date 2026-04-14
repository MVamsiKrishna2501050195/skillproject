import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI } from '../api/services';
import { FiBook, FiUsers, FiAward, FiUser } from 'react-icons/fi';

export default function MyCourses() {
    const { user, isInstructor } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            if (isInstructor) {
                const res = await courseAPI.getByInstructor(user.id);
                setCourses(res.data);
            } else {
                const res = await enrollmentAPI.getStudentEnrollments(user.id);
                setEnrollments(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>{isInstructor ? 'My Created Courses' : 'My Enrolled Courses'}</h2>
                <p>{isInstructor ? 'Manage your courses and content' : 'Track your learning progress'}</p>
            </div>

            {isInstructor ? (
                <>
                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiBook /></div>
                            <h3>No courses created yet</h3>
                            <p>Start building your first course</p>
                            <Link to="/create-course" className="btn btn-primary">Create Course</Link>
                        </div>
                    ) : (
                        <div className="course-grid">
                            {courses.map(course => (
                                <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
                                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={course.title} className="thumbnail" />
                                    <div className="course-body">
                                        <span className="course-category">{course.category || 'General'}</span>
                                        <h3>{course.title}</h3>
                                        <p className="course-desc">{course.description}</p>
                                        <div className="course-meta">
                                            <span><FiBook /> {course.lessonCount} lessons</span>
                                            <span><FiUsers /> {course.enrollmentCount} students</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {enrollments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiAward /></div>
                            <h3>You haven't enrolled in any courses yet</h3>
                            <p>Browse our catalog and start your journey</p>
                            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                        </div>
                    ) : (
                        <div className="course-grid">
                            {enrollments.map(enrollment => (
                                <Link to={`/courses/${enrollment.courseId}`} key={enrollment.id} className="course-card">
                                    <img src={enrollment.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} alt={enrollment.courseTitle} className="thumbnail" />
                                    <div className="course-body">
                                        <span className="course-category">{enrollment.courseCategory || 'General'}</span>
                                        <h3>{enrollment.courseTitle}</h3>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar-fill" style={{ width: `${enrollment.progressPercent}%` }} />
                                            </div>
                                            <div className="progress-text">
                                                {enrollment.completedLessons}/{enrollment.totalLessons} lessons · {Math.round(enrollment.progressPercent)}% complete
                                            </div>
                                        </div>
                                        <div className="course-meta">
                                            <span><FiUser /> {enrollment.instructorName}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
