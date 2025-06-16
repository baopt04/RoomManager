package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.image.CreateImageDTO;
import com.example.roommanagement.dto.request.image.UpdateImageDTO;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.infrastructure.cloudinary.UploadImageService;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ImageRepository;
import com.example.roommanagement.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageServiceImpl implements ImageService {
    @Override
    public Reponse<CreateImageDTO> create(CreateImageDTO createImageDTO , MultipartFile file) {
//        if (file == null || file.isEmpty()) {
//            throw new IllegalArgumentException("Image file cannot be null or empty");
//        }
//
//        String urlImage = uploadImageService.uploadImage(file);
//        Image image = Image.builder()
//                .name(urlImage)
//                .room(createImageDTO.getRoom())
//                .contract(createImageDTO.getContract())
//                .build();
//        imageRepository.save(image);
//        return new Reponse<>(200 , Constrants.CREATE , createImageDTO);
        return null;
    }

    @Override
    public Reponse<UpdateImageDTO> update(String id, UpdateImageDTO updateImageDTO) {
        return null;
    }

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private UploadImageService uploadImageService;
}
