package com.lms.service;

import com.lms.dto.EnrollmentDTO;
import com.lms.entity.*;
import com.lms.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository,
            UserRepository userRepository, LessonRepository lessonRepository,
            ProgressRepository progressRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
    }

    public EnrollmentDTO enroll(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        return toDTO(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentDTO> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public boolean isEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    private EnrollmentDTO toDTO(Enrollment enrollment) {
        int totalLessons = lessonRepository.countByCourseId(enrollment.getCourse().getId());
        int completedLessons = progressRepository.countByEnrollmentIdAndCompletedTrue(enrollment.getId());
        double progressPercent = totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0;

        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getName());
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setCourseTitle(enrollment.getCourse().getTitle());
        dto.setCourseThumbnail(enrollment.getCourse().getThumbnail());
        dto.setCourseCategory(enrollment.getCourse().getCategory());
        dto.setInstructorName(enrollment.getCourse().getInstructor().getName());
        dto.setTotalLessons(totalLessons);
        dto.setCompletedLessons(completedLessons);
        dto.setProgressPercent(Math.round(progressPercent * 100.0) / 100.0);
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }
}
