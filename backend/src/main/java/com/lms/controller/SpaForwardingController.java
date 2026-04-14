package com.lms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards SPA routes to the React index.html.
 * Ensures that deep links and browser refreshes work natively 
 * by routing all client-side Paths to the static Vite build.
 */
@Controller
public class SpaForwardingController {

    @RequestMapping(value = {
        "/",
        "/login", 
        "/register", 
        "/dashboard", 
        "/courses", 
        "/courses/**", 
        "/my-courses", 
        "/create-course", 
        "/create-quiz/**", 
        "/quiz/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
