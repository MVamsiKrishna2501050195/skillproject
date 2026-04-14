package com.lms.service;

import com.lms.dto.*;
import com.lms.entity.*;
import com.lms.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

        private final QuizRepository quizRepository;
        private final QuestionRepository questionRepository;
        private final CourseRepository courseRepository;

        public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository,
                        CourseRepository courseRepository) {
                this.quizRepository = quizRepository;
                this.questionRepository = questionRepository;
                this.courseRepository = courseRepository;
        }

        public List<QuizDTO> getQuizzesByCourse(Long courseId) {
                return quizRepository.findByCourseId(courseId).stream().map(this::toDTO).collect(Collectors.toList());
        }

        public QuizDTO getQuizById(Long id) {
                return toDTO(quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found")));
        }

        public QuizDTO getQuizForStudent(Long id) {
                QuizDTO dto = getQuizById(id);
                if (dto.getQuestions() != null) {
                        dto.getQuestions().forEach(q -> q.setCorrectAnswer(null));
                }
                return dto;
        }

        public QuizDTO createQuiz(Long courseId, QuizDTO request) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));
                Quiz quiz = new Quiz();
                quiz.setTitle(request.getTitle());
                quiz.setCourse(course);
                Quiz savedQuiz = quizRepository.save(quiz);

                if (request.getQuestions() != null) {
                        List<Question> questions = request.getQuestions().stream().map(qDto -> {
                                Question q = new Question();
                                q.setText(qDto.getText());
                                q.setOptionA(qDto.getOptionA());
                                q.setOptionB(qDto.getOptionB());
                                q.setOptionC(qDto.getOptionC());
                                q.setOptionD(qDto.getOptionD());
                                q.setCorrectAnswer(qDto.getCorrectAnswer());
                                q.setQuiz(savedQuiz);
                                return q;
                        }).collect(Collectors.toList());
                        questionRepository.saveAll(questions);
                        savedQuiz.setQuestions(questions);
                }
                return toDTO(savedQuiz);
        }

        public QuizResult submitQuiz(Long quizId, QuizSubmission submission) {
                List<Question> questions = questionRepository.findByQuizId(quizId);
                Map<Long, Boolean> results = new HashMap<>();
                int correct = 0;

                for (Question q : questions) {
                        String selected = submission.getAnswers().get(q.getId());
                        boolean isCorrect = q.getCorrectAnswer().equalsIgnoreCase(selected);
                        results.put(q.getId(), isCorrect);
                        if (isCorrect)
                                correct++;
                }

                double scorePercent = questions.size() > 0 ? (double) correct / questions.size() * 100 : 0;

                QuizResult result = new QuizResult();
                result.setTotalQuestions(questions.size());
                result.setCorrectAnswers(correct);
                result.setScorePercent(Math.round(scorePercent * 100.0) / 100.0);
                result.setQuestionResults(results);
                return result;
        }

        private QuizDTO toDTO(Quiz quiz) {
                List<QuestionDTO> questionDTOs = quiz.getQuestions() != null
                                ? quiz.getQuestions().stream().map(q -> {
                                        QuestionDTO dto = new QuestionDTO();
                                        dto.setId(q.getId());
                                        dto.setText(q.getText());
                                        dto.setOptionA(q.getOptionA());
                                        dto.setOptionB(q.getOptionB());
                                        dto.setOptionC(q.getOptionC());
                                        dto.setOptionD(q.getOptionD());
                                        dto.setCorrectAnswer(q.getCorrectAnswer());
                                        return dto;
                                }).collect(Collectors.toList())
                                : new ArrayList<>();

                QuizDTO dto = new QuizDTO();
                dto.setId(quiz.getId());
                dto.setTitle(quiz.getTitle());
                dto.setCourseId(quiz.getCourse().getId());
                dto.setQuestions(questionDTOs);
                return dto;
        }
}
