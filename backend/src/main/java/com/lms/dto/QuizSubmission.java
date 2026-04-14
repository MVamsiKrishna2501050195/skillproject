package com.lms.dto;

import java.util.Map;

public class QuizSubmission {
    private Map<Long, String> answers;

    public QuizSubmission() {
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
