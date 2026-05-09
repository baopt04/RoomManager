package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.contract.*;
import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.infrastructure.error.Reponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContractService {
    Page<FindAllContractDTO> findAll(Pageable pageable);
    CreateContractDTO create(CreateContractDTO createContractDTO);
    UpdateContractDTO update(String id ,UpdateContractDTO updateContractDTO);
    DetailContractDTO detail(String id);
}
