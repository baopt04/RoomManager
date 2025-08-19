package com.example.roommanagement.dto.request.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefreshTokenDTO {
    private String accessToken;
}
