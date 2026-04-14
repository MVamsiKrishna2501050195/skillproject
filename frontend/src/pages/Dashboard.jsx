import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI } from '../api/services';
import { FiBook, FiUsers, FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';

export default function Dashboard() {
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
                const allCourses = await courseAPI.getAll();
                setCourses(allCourses.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    const totalEnrolled = isInstructor
        ? courses.reduce((sum, c) => sum + c.enrollmentCount, 0)
        : enrollments.length;
    const avgProgress = isInstructor
        ? 0
        : enrollments.length > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length)
            : 0;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>Welcome back, {user.name}</h2>
                <p>{isInstructor ? 'Manage your courses and track student progress' : 'Continue your learning journey'}</p>
            </div>

            <div className="stat-grid">
                <div className="stat-card fade-in-delay-1">
                    <div className="stat-icon purple"><FiBook /></div>
                    <div className="stat-info">
                        <h3>{isInstructor ? courses.length : enrollments.length}</h3>
                        <p>{isInstructor ? 'Courses Created' : 'Enrolled Courses'}</p>
                    </div>
                </div>
                <div className="stat-card fade-in-delay-2">
                    <div className="stat-icon green"><FiUsers /></div>
                    <div className="stat-info">
                        <h3>{totalEnrolled}</h3>
                        <p>{isInstructor ? 'Total Students' : 'Courses Joined'}</p>
                    </div>
                </div>
                {isInstructor ? (
                    <div className="stat-card fade-in-delay-3">
                        <div className="stat-icon yellow"><FiAward /></div>
                        <div className="stat-info">
                            <h3>{courses.reduce((sum, c) => sum + c.lessonCount, 0)}</h3>
                            <p>Total Lessons</p>
                        </div>
                    </div>
                ) : (
                    <div className="stat-card fade-in-delay-3">
                        <div className="stat-icon yellow"><FiTrendingUp /></div>
                        <div className="stat-info">
                            <h3>{avgProgress}%</h3>
                            <p>Avg Progress</p>
                        </div>
                    </div>
                )}
            </div>

            {isInstructor ? (
                <>
                    <div className="section-title">
                        <h3>Your Courses</h3>
                        <Link to="/create-course" className="btn btn-primary btn-sm">+ Create Course</Link>
                    </div>
                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiBook /></div>
                            <h3>No courses yet</h3>
                            <p>Create your first course and start teaching</p>
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
                    <div className="section-title">
                        <h3>Continue Learning</h3>
                        <Link to="/courses" className="btn btn-secondary btn-sm">Browse All</Link>
                    </div>
                    {enrollments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiAward /></div>
                            <h3>No courses enrolled</h3>
                            <p>Browse our catalog and start learning something new</p>
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
                                            <div className="progress-text">{enrollment.completedLessons}/{enrollment.totalLessons} lessons · {Math.round(enrollment.progressPercent)}% complete</div>
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
