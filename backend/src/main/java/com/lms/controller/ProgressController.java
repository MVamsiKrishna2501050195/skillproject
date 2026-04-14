package com.lms.controller;

import com.lms.dto.ProgressDTO;
import com.lms.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/complete")
    public ResponseEntity<?> markComplete(@RequestParam Long studentId, @RequestParam Long courseId,
            @RequestParam Long lessonId) {
        try {
            progressService.markLessonComplete(studentId, courseId, lessonId);
            return ResponseEntity.ok(Map.of("message", "Lesson marked as complete"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ProgressDTO> getProgress(@PathVariable Long courseId, @RequestParam Long studentId) {
        return ResponseEntity.ok(progressService.getProgressForCourse(studentId, courseId));
    }
}
