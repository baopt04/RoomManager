package com.example.roommanagement.repository;

import com.example.roommanagement.entity.Image;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;
@Registered
public interface ImageRepository extends JpaRepository<Image, String> {
}
