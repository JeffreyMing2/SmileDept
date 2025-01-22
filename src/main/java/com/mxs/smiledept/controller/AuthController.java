package com.mxs.smiledept.controller;

import com.mxs.smiledept.common.response.Result;
import com.mxs.smiledept.model.dto.LoginRequest;
import com.mxs.smiledept.model.dto.LoginResponse;
import com.mxs.smiledept.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return Result.success(response);
        } catch (Exception e) {
            return Result.error(400, e.getMessage());
        }
    }
} 