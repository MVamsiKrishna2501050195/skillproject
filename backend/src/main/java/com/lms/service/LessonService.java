package com.lms.service;

import com.lms.dto.LessonDTO;
import com.lms.entity.Course;
import com.lms.entity.Lesson;
import com.lms.repository.CourseRepository;
import com.lms.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public LessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    public List<LessonDTO> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LessonDTO getLessonById(Long id) {
        return toDTO(lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found")));
    }

    public LessonDTO createLesson(Long courseId, LessonDTO request) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        int nextOrder = lessonRepository.countByCourseId(courseId) + 1;
        Lesson lesson = new Lesson();
        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : nextOrder);
        lesson.setDurationMinutes(request.getDurationMinutes());
        lesson.setCourse(course);
        return toDTO(lessonRepository.save(lesson));
    }

    public LessonDTO updateLesson(Long id, LessonDTO request) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setDurationMinutes(request.getDurationMinutes());
        return toDTO(lessonRepository.save(lesson));
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    private LessonDTO toDTO(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setContent(lesson.getContent());
        dto.setOrderIndex(lesson.getOrderIndex());
        dto.setDurationMinutes(lesson.getDurationMinutes());
        dto.setCourseId(lesson.getCourse().getId());
        return dto;
    }
}
