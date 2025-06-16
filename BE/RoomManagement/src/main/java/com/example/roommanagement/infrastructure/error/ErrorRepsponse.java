package com.example.roommanagement.infrastructure.error;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ErrorRepsponse {
    private int status;
    private String message;
}
