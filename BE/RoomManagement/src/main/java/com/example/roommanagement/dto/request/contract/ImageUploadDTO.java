package com.example.roommanagement.dto.request.contract;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadDTO {
    private String fileName;
    private byte[] content;
}
