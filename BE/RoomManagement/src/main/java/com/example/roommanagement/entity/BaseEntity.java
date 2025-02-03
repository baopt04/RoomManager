package com.example.roommanagement.entity;

import com.example.roommanagement.infrastructure.lister.CreatePrimaryLister;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(CreatePrimaryLister.class)
public class BaseEntity implements Isdentityfied {
    public static final byte LENGTH_ID = 36;
   @Id
   @Column(length = LENGTH_ID , updatable = false)
    private String id;
    @Column(name = "create_date")
    private LocalDateTime createDate;
    @Column(name = "create_by")
    private String createBy;
    @Column(name = "update_by")
    private String updateBy;
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
@PrePersist
    private void onCreate() {
    this.createDate = LocalDateTime.now();
    this.createBy = getCurrmentUserName();
    this.lastModifiedDate = LocalDateTime.now();
    this.updateBy = getCurrmentUserName();
}
@PreUpdate
    private void onUpdate() {
    this.lastModifiedDate = LocalDateTime.now();
    this.updateBy = getCurrmentUserName();
}
private String getCurrmentUserName(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof String) {
        return (String) authentication.getPrincipal();
    }
    return "unknown";
}
}
