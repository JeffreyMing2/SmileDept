package com.mxs.smiledept.model.dto;

import com.mxs.smiledept.model.enums.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String avatar;
    private UserRole role;
} 