package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.host.BaseHostDTO;
import com.example.roommanagement.dto.request.host.CreateHostDTO;
import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.dto.request.host.UpdateHostDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import org.eclipse.angus.mail.iap.Response;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HostService {
    Page<FindAllHostDTO> findAllHosts(Pageable pageable);
   CreateHostDTO create(CreateHostDTO createHostDTO);
    UpdateHostDTO update(String id , UpdateHostDTO updateHostDTO);
    Reponse<FindAllHostDTO> getOneEmail(String email);
    Reponse<FindAllHostDTO> getOneNumberPhone(String phone);
    BaseHostDTO detail(String id);
}
