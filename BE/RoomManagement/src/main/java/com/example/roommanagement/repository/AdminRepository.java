package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.admin.BaseAdminDTO;
import com.example.roommanagement.dto.request.admin.FindAllAdminDTO;
import com.example.roommanagement.dto.request.admin.SearchAdminDTO;
import com.example.roommanagement.dto.respon.AdminRespon;
import com.example.roommanagement.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findAdminByEmail(String email);

    boolean existsAdminByEmail(String email);

    boolean existsByNumberPhone(String numberPhone);

    Optional<Admin> findByEmail(String email);

    @Query(value = """
              SELECT 
             ROW_NUMBER() over(order by ad.last_modified_date desc) as stt ,
                         ad.id as id,
              ad.code as code,
              ad.name as name,
              ad.email as email, 
              ad.number_phone as numberPhone,
              ad.role as role 
              FROM Admin ad
            """, nativeQuery = true)
    List<FindAllAdminDTO> getAllAdmins();

    @Query(value = """
            SELECT 
          ROW_NUMBER() over(order by ad.last_modified_date desc) as stt ,
                    ad.id as id,
             ad.code as code ,
             ad.name as name , 
             ad.email as email ,
             ad.number_phone as numberPhone ,
             ad.role as role 
             FROM Admin ad WHERE ad.email =:email
            """, nativeQuery = true)
    FindAllAdminDTO getOneAdminByEmail(@Param("email") String email);
    @Query(value = """
            SELECT 
          ROW_NUMBER() over(order by ad.last_modified_date desc) as stt ,
                    ad.id as id,
             ad.code as code ,
             ad.name as name , 
             ad.email as email ,
             ad.number_phone as numberPhone ,
             ad.role as role 
             FROM Admin ad WHERE ad.number_phone =:numberPhone
            """, nativeQuery = true)
    FindAllAdminDTO getOneAdminByNumberPhone(@Param("numberPhone") String numberPhone);
}
