import API from './axios';

export const authAPI = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
};

export const courseAPI = {
    getAll: () => API.get('/courses'),
    getById: (id) => API.get(`/courses/${id}`),
    getByInstructor: (id) => API.get(`/courses/instructor/${id}`),
    create: (data, instructorId) => API.post(`/courses?instructorId=${instructorId}`, data),
    update: (id, data) => API.put(`/courses/${id}`, data),
    delete: (id) => API.delete(`/courses/${id}`),
};

export const lessonAPI = {
    getByCourse: (courseId) => API.get(`/lessons/course/${courseId}`),
    getById: (id) => API.get(`/lessons/${id}`),
    create: (courseId, data) => API.post(`/lessons/course/${courseId}`, data),
    update: (id, data) => API.put(`/lessons/${id}`, data),
    delete: (id) => API.delete(`/lessons/${id}`),
};

export const enrollmentAPI = {
    enroll: (studentId, courseId) => API.post(`/enrollments?studentId=${studentId}&courseId=${courseId}`),
    getStudentEnrollments: (studentId) => API.get(`/enrollments/student/${studentId}`),
    checkEnrollment: (studentId, courseId) => API.get(`/enrollments/check?studentId=${studentId}&courseId=${courseId}`),
};

export const progressAPI = {
    markComplete: (studentId, courseId, lessonId) =>
        API.post(`/progress/complete?studentId=${studentId}&courseId=${courseId}&lessonId=${lessonId}`),
    getCourseProgress: (courseId, studentId) =>
        API.get(`/progress/course/${courseId}?studentId=${studentId}`),
};

export const quizAPI = {
    getByCourse: (courseId) => API.get(`/quizzes/course/${courseId}`),
    getById: (id) => API.get(`/quizzes/${id}`),
    getForStudent: (id) => API.get(`/quizzes/${id}/student`),
    create: (courseId, data) => API.post(`/quizzes/course/${courseId}`, data),
    submit: (id, data) => API.post(`/quizzes/${id}/submit`, data),
};
