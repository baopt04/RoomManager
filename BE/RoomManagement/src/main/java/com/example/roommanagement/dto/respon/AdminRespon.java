package com.example.roommanagement.dto.respon;

import com.example.roommanagement.entity.Admin;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = Admin.class)
public interface AdminRespon {
    @Value("#{target.stt}")
    Integer getSTT();
    @Value("#{target.id}")
    String getId();
    @Value("#{target.name}")
    String getName();
    @Value("#{target.code}")
    String getCode();
    @Value("#{target.email}")
    String getEmail();
    @Value("#{target.password}")
    String getPassword();
    @Value("#{target.numberPhone}")
    String getNumberPhone();
    @Value("#{target.createDate}")
    LocalDateTime getCreateDate();
    @Value("#{target.createBy}")
    String getCreateBy();
    @Value("#{target.updateBy}")
    String getUpdateBy();
    @Value("#{target.lastModifiedDate}")
    LocalDateTime getLastModifiedDate();
}
