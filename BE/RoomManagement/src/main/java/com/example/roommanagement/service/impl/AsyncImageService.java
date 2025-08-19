package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.ImageUploadDTO;
import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.cloudinary.UploadImageService;
import com.example.roommanagement.infrastructure.constant.TypeImages;
import com.example.roommanagement.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AsyncImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UploadImageService uploadImageService;

    @Async
    @Transactional
    public void uploadImages(List<ImageUploadDTO> imageUploadDTOs, Contract contract) {
        for (ImageUploadDTO imageDTO : imageUploadDTOs) {
            try {
                String urlImage = uploadImageService.uploadImage(imageDTO.getFileName(), imageDTO.getContent());

                Image image = Image.builder()
                        .name(urlImage)
                        .contract(contract)
                        .room(contract.getRoom())
                        .type(TypeImages.CONTRACT)
                        .build();

                imageRepository.save(image);
            } catch (Exception e) {
                System.err.println("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }
    }
    @Async
    @Transactional
    public void uploadImagesRoom(List<ImageUploadDTO> imageUploadDTOs, Room room) {
        for (ImageUploadDTO imageDTO : imageUploadDTOs) {
            try {
                String urlImage = uploadImageService.uploadImage(imageDTO.getFileName(), imageDTO.getContent());
                Image image = Image.builder()
                        .name(urlImage)
                        .room(room)
                        .type(TypeImages.ROOM)
                        .build();

                imageRepository.save(image);
            } catch (Exception e) {
                System.err.println("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }
    }
    @Transactional
    public void updateImagesForUpdate(List<ImageUploadDTO> imageUploadDTOs, Contract contract) {
        for (ImageUploadDTO imageDTO : imageUploadDTOs) {
            try {
                String urlImage = uploadImageService.uploadImage(imageDTO.getFileName(), imageDTO.getContent());

                Image image = Image.builder()
                        .name(urlImage)
                        .contract(contract)
                        .room(contract.getRoom())
                        .type(TypeImages.CONTRACT)
                        .build();

                imageRepository.save(image);
            } catch (Exception e) {
                System.err.println("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }
    }
    @Transactional
    public void updateImagesForUpdateRoom(List<ImageUploadDTO> imageUploadDTOs, Room room) {
        for (ImageUploadDTO imageDTO : imageUploadDTOs) {
            try {
                String urlImage = uploadImageService.uploadImage(imageDTO.getFileName(), imageDTO.getContent());

                Image image = Image.builder()
                        .name(urlImage)
                        .room(room)
                        .type(TypeImages.ROOM)
                        .build();

                imageRepository.save(image);
            } catch (Exception e) {
                System.err.println("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }
    }
    }

