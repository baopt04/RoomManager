package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.host.CreateHostDTO;
import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.dto.request.host.UpdateHostDTO;
import com.example.roommanagement.entity.Host;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.HostRepository;
import com.example.roommanagement.service.HostService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HostServiceImpl implements HostService {
    @Autowired
    private HostRepository hostRepository;
    @Autowired
    private Generate generate;

    @Override
    public List<FindAllHostDTO> findAllHosts() {
        return hostRepository.findAllHosts();
    }

    @Override
    public Reponse<CreateHostDTO> create(CreateHostDTO createHostDTO) {
        if (hostRepository.existsByEmail(createHostDTO.getEmail())) {
            return new Reponse<>(400, Constrants.EMAIL_EXISTS, null);
        }
        if (hostRepository.existsByNumberPhone(createHostDTO.getNumberPhone())) {
            return new Reponse<>(400, Constrants.NUMBER_PHONE_EXISTS, null);
        }
        Host host = Host.builder()
                .name(createHostDTO.getName())
                .code(generate.generateCodeHost())
                .email(createHostDTO.getEmail())
                .numberPhone(createHostDTO.getNumberPhone())
                .gender(createHostDTO.getGender())
                .build();
        hostRepository.save(host);
        return new Reponse<>(400, Constrants.CREATE, createHostDTO);
    }

    @Override
    public Reponse<UpdateHostDTO> update(String id, UpdateHostDTO updateHostDTO) {
        Optional<Host> findById = hostRepository.findById(id);
        if (!findById.isPresent()) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        if (!findById.get().getEmail().equals(updateHostDTO.getEmail())) {
            if (hostRepository.existsByEmail(updateHostDTO.getEmail())) {
                return new Reponse<>(400, Constrants.EMAIL_EXISTS, null);
            }
        }
        if (!findById.get().getNumberPhone().equals(updateHostDTO.getNumberPhone())) {
            if (hostRepository.existsByNumberPhone(updateHostDTO.getNumberPhone())) {
                return new Reponse<>(400, Constrants.NUMBER_PHONE_EXISTS, null);
            }
        }
        findById.get().setName(updateHostDTO.getName());
        findById.get().setNumberPhone(updateHostDTO.getNumberPhone());
        findById.get().setGender(updateHostDTO.getGender());
        findById.get().setEmail(updateHostDTO.getEmail());
        hostRepository.save(findById.get());
        return new Reponse<>(200, Constrants.UPDATE, updateHostDTO);
    }

    @Override
    public Reponse<FindAllHostDTO> getOneEmail(String email) {
        if (email == null || email.isEmpty()) {
            return new Reponse<>(400, Constrants.FIND_EMAIL_NULL, null);
        }
        FindAllHostDTO findAllHostDTO = hostRepository.getOneHostByEmail(email);
        if (findAllHostDTO == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, findAllHostDTO);
    }

    @Override
    public Reponse<FindAllHostDTO> getOneNumberPhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            return new Reponse<>(400, Constrants.FIND_PHONE_NULL, null);
        }
        FindAllHostDTO findAllHostDTO = hostRepository.getOneHostByNumberPhone(phone);
        if (findAllHostDTO == null) {
            return new Reponse<>(404, Constrants.NOT_FOUND, null);
        }
        return new Reponse<>(200, Constrants.GET_SUCCESS, findAllHostDTO);
    }
}
