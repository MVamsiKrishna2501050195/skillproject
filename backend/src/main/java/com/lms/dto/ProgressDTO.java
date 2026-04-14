package com.lms.dto;

import java.util.List;

public class ProgressDTO {
    private Long enrollmentId;
    private Long courseId;
    private int totalLessons;
    private int completedLessons;
    private double progressPercent;
    private List<LessonProgressDTO> lessonProgresses;

    public ProgressDTO() {
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public double getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(double progressPercent) {
        this.progressPercent = progressPercent;
    }

    public List<LessonProgressDTO> getLessonProgresses() {
        return lessonProgresses;
    }

    public void setLessonProgresses(List<LessonProgressDTO> lessonProgresses) {
        this.lessonProgresses = lessonProgresses;
    }

    public static class LessonProgressDTO {
        private Long lessonId;
        private String lessonTitle;
        private boolean completed;

        public LessonProgressDTO() {
        }

        public Long getLessonId() {
            return lessonId;
        }

        public void setLessonId(Long lessonId) {
            this.lessonId = lessonId;
        }

        public String getLessonTitle() {
            return lessonTitle;
        }

        public void setLessonTitle(String lessonTitle) {
            this.lessonTitle = lessonTitle;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }
}
