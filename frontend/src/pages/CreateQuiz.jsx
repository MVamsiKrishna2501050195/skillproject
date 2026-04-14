import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../api/services';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CreateQuiz() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }
    ]);
    const [loading, setLoading] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]);
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) return;
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await quizAPI.create(courseId, { title, questions });
            navigate(`/courses/${courseId}`);
        } catch (err) {
            alert('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h2>Create Quiz</h2>
                <p>Add questions for your students to test their knowledge</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Quiz Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Chapter 1 Assessment"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {questions.map((q, idx) => (
                    <div key={idx} className="card" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span className="badge badge-purple">Question {idx + 1}</span>
                            {questions.length > 1 && (
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(idx)}>
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Question Text *</label>
                            <textarea
                                className="form-control"
                                value={q.text}
                                onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
                                placeholder="Enter your question..."
                                required
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {['A', 'B', 'C', 'D'].map(opt => (
                                <div className="form-group" key={opt} style={{ marginBottom: '8px' }}>
                                    <label>Option {opt} *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={q[`option${opt}`]}
                                        onChange={(e) => updateQuestion(idx, `option${opt}`, e.target.value)}
                                        placeholder={`Option ${opt}`}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Correct Answer *</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={`btn ${q.correctAnswer === opt ? 'btn-success' : 'btn-secondary'} btn-sm`}
                                        onClick={() => updateQuestion(idx, 'correctAnswer', opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                        <FiPlus /> Add Question
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Quiz'}
                    </button>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
