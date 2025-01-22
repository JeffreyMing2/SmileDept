package com.mxs.smiledept;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SmileDeptApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmileDeptApplication.class, args);
    }
} 