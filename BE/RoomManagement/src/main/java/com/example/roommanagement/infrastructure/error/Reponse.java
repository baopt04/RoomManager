package com.example.roommanagement.infrastructure.error;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reponse<T> {
    private Integer status;
    private String message;
    private T data;
}
