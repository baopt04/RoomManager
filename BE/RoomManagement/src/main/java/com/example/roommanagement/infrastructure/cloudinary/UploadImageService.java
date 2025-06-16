package com.example.roommanagement.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Configuration
public class UploadImageService {
    @Autowired
    private Cloudinary cloudinary;
    public String uploadImage(String fileName, byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            throw new IllegalArgumentException("File content cannot be null or empty");
        }
        try {
            Map uploadResult = cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                    "public_id", fileName
            ));
            return (String) uploadResult.get("url");
        } catch (Exception e) {
            e.printStackTrace();
            return "upload fail";
        }
    }
    public void deleteImage(String imageUrl) throws Exception {

    }

}
