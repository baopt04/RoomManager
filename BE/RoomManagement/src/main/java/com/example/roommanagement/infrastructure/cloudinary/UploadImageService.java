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
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }
        try {

            Map updloadResult = cloudinary.uploader().upload(file.getBytes() , ObjectUtils.emptyMap());
            return (String) updloadResult.get("url");
        }catch (Exception e){
            e.printStackTrace();
            return "upload fail";
        }
    }
}
