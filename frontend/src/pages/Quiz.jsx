import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../api/services';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';

export default function Quiz() {
    const { id } = useParams();
    const { isInstructor } = useAuth();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    const loadQuiz = async () => {
        try {
            const res = isInstructor
                ? await quizAPI.getById(id)
                : await quizAPI.getForStudent(id);
            setQuiz(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (questionId, option) => {
        if (result) return; // Don't allow changes after submission
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quiz.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await quizAPI.submit(id, { answers });
            setResult(res.data);
        } catch (err) {
            alert('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (!quiz) return <div className="empty-state"><h3>Quiz not found</h3></div>;

    const getOptionClass = (questionId, option) => {
        const isSelected = answers[questionId] === option;
        if (!result) return isSelected ? 'selected' : '';

        const isCorrect = result.questionResults[questionId];
        if (isSelected && isCorrect) return 'correct';
        if (isSelected && !isCorrect) return 'incorrect';

        // Show correct answer after submission
        // We need to check if this is the correct answer by checking if it matches
        // We'll just show selected state
        return '';
    };

    return (
        <div className="fade-in">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                <FiArrowLeft /> Back to Course
            </button>

            {result ? (
                <div className="card result-card" style={{ marginBottom: '32px' }}>
                    <div className="result-score">{Math.round(result.scorePercent)}%</div>
                    <div className="result-label">
                        {result.correctAnswers} out of {result.totalQuestions} correct
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => { setResult(null); setAnswers({}); }}>
                            Retake Quiz
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Back to Course
                        </button>
                    </div>
                </div>
            ) : (
                <div className="page-header">
                    <h2>{quiz.title}</h2>
                    <p>{quiz.questions.length} questions</p>
                </div>
            )}

            <div className="quiz-container">
                {quiz.questions.map((q, idx) => (
                    <div key={q.id} className="question-card">
                        <div className="question-number">Question {idx + 1}</div>
                        <div className="question-text">{q.text}</div>
                        <div className="option-list">
                            {['A', 'B', 'C', 'D'].map(opt => {
                                const optionText = q[`option${opt}`];
                                return (
                                    <button
                                        key={opt}
                                        className={`option-item ${getOptionClass(q.id, opt)}`}
                                        onClick={() => handleSelect(q.id, opt)}
                                        disabled={!!result}
                                    >
                                        <span className="option-label">{opt}</span>
                                        <span>{optionText}</span>
                                        {result && answers[q.id] === opt && (
                                            result.questionResults[q.id]
                                                ? <FiCheck style={{ color: 'var(--success)', marginLeft: 'auto' }} />
                                                : <FiX style={{ color: 'var(--danger)', marginLeft: 'auto' }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {!result && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
