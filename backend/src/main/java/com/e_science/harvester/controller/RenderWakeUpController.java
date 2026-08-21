/**
 * Infrastructure/DevOps endpoint. 
 * Purpose: Prevents the Render hosting platform from spinning down due to inactivity.
 * Note: This endpoint is strictly for keeping the instance alive and is unrelated 
 * to the core application features.
 */

package com.e_science.harvester.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class RenderWakeUpController {

    @GetMapping("/wake-up")
    public String wakeUp() {
        return "Render is awake and ready to work!";
    }
}