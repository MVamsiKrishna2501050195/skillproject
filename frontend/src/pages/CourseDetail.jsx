import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, progressAPI, quizAPI, lessonAPI } from '../api/services';
import { FiBook, FiUsers, FiClock, FiUser, FiCheck, FiPlay, FiPlus } from 'react-icons/fi';

export default function CourseDetail() {
    const { id } = useParams();
    const { user, isInstructor, isStudent } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [progress, setProgress] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [tab, setTab] = useState('lessons');
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [lessonForm, setLessonForm] = useState({ title: '', content: '', durationMinutes: 30 });

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            const courseRes = await courseAPI.getById(id);
            setCourse(courseRes.data);

            const quizRes = await quizAPI.getByCourse(id);
            setQuizzes(quizRes.data);

            if (isStudent) {
                const enrollRes = await enrollmentAPI.checkEnrollment(user.id, id);
                setEnrolled(enrollRes.data.enrolled);
                if (enrollRes.data.enrolled) {
                    const progressRes = await progressAPI.getCourseProgress(id, user.id);
                    setProgress(progressRes.data);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            await enrollmentAPI.enroll(user.id, id);
            setEnrolled(true);
            const progressRes = await progressAPI.getCourseProgress(id, user.id);
            setProgress(progressRes.data);
        } catch (err) {
            alert(err.response?.data?.error || 'Enrollment failed');
        }
    };

    const handleMarkComplete = async (lessonId) => {
        try {
            await progressAPI.markComplete(user.id, id, lessonId);
            const progressRes = await progressAPI.getCourseProgress(id, user.id);
            setProgress(progressRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await lessonAPI.create(id, lessonForm);
            setShowAddLesson(false);
            setLessonForm({ title: '', content: '', durationMinutes: 30 });
            loadCourse();
        } catch (err) {
            alert('Failed to add lesson');
        }
    };

    const isLessonCompleted = (lessonId) => {
        if (!progress) return false;
        return progress.lessonProgresses?.some(lp => lp.lessonId === lessonId && lp.completed);
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (!course) return <div className="empty-state"><h3>Course not found</h3></div>;

    const renderContent = (text) => {
        if (!text) return null;
        const parts = text.split('\n');
        return parts.map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
            if (line.startsWith('```')) return null;
            if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i}>{line.slice(2)}</li>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
        });
    };

    return (
        <div className="fade-in">
            <div className="course-detail-header">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={course.title}
                    className="course-thumb"
                />
                <div className="course-detail-info">
                    <span className="badge badge-purple">{course.category || 'General'}</span>
                    <h1>{course.title}</h1>
                    <p className="description">{course.description}</p>

                    <div className="course-detail-stats">
                        <div className="detail-stat">
                            <FiUser className="icon" /> <span>{course.instructorName}</span>
                        </div>
                        <div className="detail-stat">
                            <FiBook className="icon" /> <span>{course.lessonCount} lessons</span>
                        </div>
                        <div className="detail-stat">
                            <FiUsers className="icon" /> <span>{course.enrollmentCount} students</span>
                        </div>
                    </div>

                    {isStudent && !enrolled && (
                        <button className="btn btn-primary btn-lg" onClick={handleEnroll}>
                            Enroll Now — Free
                        </button>
                    )}

                    {enrolled && progress && (
                        <div style={{ maxWidth: '300px' }}>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progress.progressPercent}%` }} />
                            </div>
                            <div className="progress-text">
                                {progress.completedLessons}/{progress.totalLessons} lessons complete · {Math.round(progress.progressPercent)}%
                            </div>
                        </div>
                    )}

                    {isInstructor && course.instructorId === user.id && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" onClick={() => setShowAddLesson(true)}>
                                <FiPlus /> Add Lesson
                            </button>
                            <Link to={`/create-quiz/${id}`} className="btn btn-secondary">
                                <FiPlus /> Add Quiz
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button className={`btn ${tab === 'lessons' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('lessons')}>
                    <FiBook /> Lessons ({course.lessons?.length || 0})
                </button>
                <button className={`btn ${tab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('quizzes')}>
                    <FiCheck /> Quizzes ({quizzes.length})
                </button>
            </div>

            {tab === 'lessons' && (
                <>
                    {selectedLesson ? (
                        <div>
                            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLesson(null)} style={{ marginBottom: '16px' }}>
                                ← Back to lessons
                            </button>
                            <div className="lesson-content">
                                <h1>{selectedLesson.title}</h1>
                                {selectedLesson.durationMinutes && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                                        <FiClock style={{ verticalAlign: 'middle' }} /> {selectedLesson.durationMinutes} min
                                    </p>
                                )}
                                <div>{renderContent(selectedLesson.content)}</div>

                                {enrolled && (
                                    <div className="lesson-actions">
                                        {isLessonCompleted(selectedLesson.id) ? (
                                            <span className="badge badge-green"><FiCheck /> Completed</span>
                                        ) : (
                                            <button className="btn btn-success" onClick={() => handleMarkComplete(selectedLesson.id)}>
                                                <FiCheck /> Mark as Complete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="lesson-list">
                            {course.lessons?.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon"><FiBook /></div>
                                    <h3>No lessons yet</h3>
                                    <p>Lessons will appear here</p>
                                </div>
                            ) : (
                                course.lessons?.map(lesson => (
                                    <div
                                        key={lesson.id}
                                        className={`lesson-item ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                                        onClick={() => (enrolled || isInstructor) && setSelectedLesson(lesson)}
                                        style={{ cursor: enrolled || isInstructor ? 'pointer' : 'default' }}
                                    >
                                        <div className="lesson-number">
                                            {isLessonCompleted(lesson.id) ? <FiCheck /> : lesson.orderIndex}
                                        </div>
                                        <div className="lesson-title">{lesson.title}</div>
                                        {lesson.durationMinutes && (
                                            <div className="lesson-duration">{lesson.durationMinutes} min</div>
                                        )}
                                        {(enrolled || isInstructor) && (
                                            <FiPlay style={{ color: 'var(--accent-primary)' }} />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {tab === 'quizzes' && (
                <div className="lesson-list">
                    {quizzes.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiCheck /></div>
                            <h3>No quizzes yet</h3>
                            <p>Quizzes will appear here once created</p>
                        </div>
                    ) : (
                        quizzes.map(quiz => (
                            <div
                                key={quiz.id}
                                className="lesson-item"
                                onClick={() => navigate(`/quiz/${quiz.id}`)}
                            >
                                <div className="lesson-number" style={{ background: 'transparent' }}><FiCheck /></div>
                                <div className="lesson-title">{quiz.title}</div>
                                <span className="badge badge-purple">{quiz.questions?.length || 0} questions</span>
                                <FiPlay style={{ color: 'var(--accent-primary)' }} />
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add Lesson Modal */}
            {showAddLesson && (
                <div className="modal-overlay" onClick={() => setShowAddLesson(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Lesson</h2>
                            <button className="modal-close" onClick={() => setShowAddLesson(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddLesson}>
                            <div className="form-group">
                                <label>Lesson Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    className="form-control"
                                    value={lessonForm.content}
                                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                    placeholder="Lesson content (supports markdown-like formatting)"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={lessonForm.durationMinutes}
                                    onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: parseInt(e.target.value) })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Add Lesson</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
