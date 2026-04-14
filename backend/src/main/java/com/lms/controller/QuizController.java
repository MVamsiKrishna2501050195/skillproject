package com.lms.controller;

import com.lms.dto.*;
import com.lms.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizzesByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/{id}/student")
    public ResponseEntity<QuizDTO> getQuizForStudent(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizForStudent(id));
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<QuizDTO> createQuiz(@PathVariable Long courseId, @RequestBody QuizDTO request) {
        return ResponseEntity.ok(quizService.createQuiz(courseId, request));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizResult> submitQuiz(@PathVariable Long id, @RequestBody QuizSubmission submission) {
        return ResponseEntity.ok(quizService.submitQuiz(id, submission));
    }
}
