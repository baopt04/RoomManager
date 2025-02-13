package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.host.CreateHostDTO;
import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.dto.request.host.UpdateHostDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface HostService {
    List<FindAllHostDTO> findAllHosts();
    Reponse<CreateHostDTO> create(CreateHostDTO createHostDTO);
    Reponse<UpdateHostDTO> update(String id , UpdateHostDTO updateHostDTO);
    Reponse<FindAllHostDTO> getOneEmail(String email);
    Reponse<FindAllHostDTO> getOneNumberPhone(String phone);
}
