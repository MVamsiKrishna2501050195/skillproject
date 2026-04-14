package com.lms.service;

import com.lms.dto.CourseDTO;
import com.lms.entity.Course;
import com.lms.entity.User;
import com.lms.repository.CourseRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    
    @Mock
    private UserRepository userRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void getAllCourses_ReturnsDtoList() {
        User inst = new User();
        inst.setId(99L);
        inst.setName("Test Instructor");

        Course c1 = new Course();
        c1.setId(1L);
        c1.setTitle("Test Course");
        c1.setCategory("Programming");
        c1.setInstructor(inst);

        when(courseRepository.findAll()).thenReturn(Arrays.asList(c1));
        lenient().when(lessonRepository.countByCourseId(1L)).thenReturn(5);

        List<CourseDTO> result = courseService.getAllCourses();

        assertEquals(1, result.size());
        assertEquals("Test Course", result.get(0).getTitle());
        assertEquals("Programming", result.get(0).getCategory());
    }
}
