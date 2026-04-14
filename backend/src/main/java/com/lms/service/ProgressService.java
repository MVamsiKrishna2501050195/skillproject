package com.lms.service;

import com.lms.dto.ProgressDTO;
import com.lms.entity.*;
import com.lms.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {

        private final ProgressRepository progressRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final LessonRepository lessonRepository;

        public ProgressService(ProgressRepository progressRepository, EnrollmentRepository enrollmentRepository,
                        LessonRepository lessonRepository) {
                this.progressRepository = progressRepository;
                this.enrollmentRepository = enrollmentRepository;
                this.lessonRepository = lessonRepository;
        }

        public void markLessonComplete(Long studentId, Long courseId, Long lessonId) {
                Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

                Optional<Progress> existing = progressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(),
                                lessonId);

                if (existing.isPresent()) {
                        Progress progress = existing.get();
                        progress.setCompleted(true);
                        progress.setCompletedAt(LocalDateTime.now());
                        progressRepository.save(progress);
                } else {
                        Progress progress = new Progress();
                        progress.setEnrollment(enrollment);
                        progress.setLesson(lessonRepository.findById(lessonId)
                                        .orElseThrow(() -> new RuntimeException("Lesson not found")));
                        progress.setCompleted(true);
                        progress.setCompletedAt(LocalDateTime.now());
                        progressRepository.save(progress);
                }
        }

        public ProgressDTO getProgressForCourse(Long studentId, Long courseId) {
                Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

                List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
                List<Progress> progresses = progressRepository.findByEnrollmentId(enrollment.getId());

                int completed = (int) progresses.stream().filter(Progress::getCompleted).count();
                int total = lessons.size();
                double percent = total > 0 ? (double) completed / total * 100 : 0;

                List<ProgressDTO.LessonProgressDTO> lessonProgresses = lessons.stream().map(lesson -> {
                        boolean isComplete = progresses.stream()
                                        .anyMatch(p -> p.getLesson().getId().equals(lesson.getId())
                                                        && p.getCompleted());
                        ProgressDTO.LessonProgressDTO lp = new ProgressDTO.LessonProgressDTO();
                        lp.setLessonId(lesson.getId());
                        lp.setLessonTitle(lesson.getTitle());
                        lp.setCompleted(isComplete);
                        return lp;
                }).collect(Collectors.toList());

                ProgressDTO dto = new ProgressDTO();
                dto.setEnrollmentId(enrollment.getId());
                dto.setCourseId(courseId);
                dto.setTotalLessons(total);
                dto.setCompletedLessons(completed);
                dto.setProgressPercent(Math.round(percent * 100.0) / 100.0);
                dto.setLessonProgresses(lessonProgresses);
                return dto;
        }
}
