package com.example.SmartLearn.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendRoutingController {

    @RequestMapping(value = {
            "/", "/signup", "/login", "/CoursePage", "/my-learning",
            "/profile", "/about", "/settings", "/courses/**", "/stream/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}

