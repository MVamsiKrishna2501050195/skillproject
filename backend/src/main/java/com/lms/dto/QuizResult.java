package com.lms.dto;

import java.util.Map;

public class QuizResult {
    private int totalQuestions;
    private int correctAnswers;
    private double scorePercent;
    private Map<Long, Boolean> questionResults;

    public QuizResult() {
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public double getScorePercent() {
        return scorePercent;
    }

    public void setScorePercent(double scorePercent) {
        this.scorePercent = scorePercent;
    }

    public Map<Long, Boolean> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(Map<Long, Boolean> questionResults) {
        this.questionResults = questionResults;
    }
}
