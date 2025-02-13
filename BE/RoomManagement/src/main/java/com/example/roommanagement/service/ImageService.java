package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.image.CreateImageDTO;
import com.example.roommanagement.dto.request.image.UpdateImageDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    Reponse<CreateImageDTO> create(CreateImageDTO createImageDTO , MultipartFile file);
    Reponse<UpdateImageDTO> update(String id , UpdateImageDTO updateImageDTO);
}
