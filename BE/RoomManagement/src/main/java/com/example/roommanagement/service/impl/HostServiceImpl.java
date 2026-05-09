package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.host.BaseHostDTO;
import com.example.roommanagement.dto.request.host.CreateHostDTO;
import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.dto.request.host.UpdateHostDTO;
import com.example.roommanagement.entity.Host;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.HostRepository;
import com.example.roommanagement.service.HostService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class HostServiceImpl implements HostService {
    @Autowired
    private HostRepository hostRepository;
    @Autowired
    private Generate generate;

    @Override
    public Page<FindAllHostDTO> findAllHosts(Pageable pageable) {
        return hostRepository.findAllHosts(pageable);
    }

    @Override
    public CreateHostDTO create(CreateHostDTO createHostDTO) {
        if (hostRepository.existsByEmail(createHostDTO.getEmail())) {
            throw new BusinessException("Email đã tồn tại!");
        }

        if (hostRepository.existsByNumberPhone(createHostDTO.getNumberPhone())) {
            throw new BusinessException("Số điện thoại đã tồn tại!");
        }
        Host host = Host.builder()
                .name(createHostDTO.getName())
                .code(generate.generateCodeHost())
                .email(createHostDTO.getEmail())
                .numberPhone(createHostDTO.getNumberPhone())
                .gender(createHostDTO.getGender())
                .build();
        hostRepository.save(host);
        return createHostDTO;
    }

    @Override
    public UpdateHostDTO update(String id, UpdateHostDTO updateHostDTO) {
        Optional<Host> findById = hostRepository.findById(id);
        if (!findById.isPresent()) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
        if (!findById.get().getEmail().equals(updateHostDTO.getEmail())) {
            if (hostRepository.existsByEmail(updateHostDTO.getEmail())) {
                throw new BusinessException(Constrants.EMAIL_EXISTS);
            }
        }
        if (!findById.get().getNumberPhone().equals(updateHostDTO.getNumberPhone())) {
            if (hostRepository.existsByNumberPhone(updateHostDTO.getNumberPhone())) {
                throw  new BusinessException( Constrants.NUMBER_PHONE_EXISTS);
            }
        }
        findById.get().setName(updateHostDTO.getName());
        findById.get().setNumberPhone(updateHostDTO.getNumberPhone());
        findById.get().setGender(updateHostDTO.getGender());
        findById.get().setEmail(updateHostDTO.getEmail());
        hostRepository.save(findById.get());
        return updateHostDTO;
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

    @Override
    public BaseHostDTO detail(String id) {
        Host host = hostRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy chủ nhà với ID: " + id));

        return new BaseHostDTO(
                host.getCode(),
                host.getName(),
                host.getNumberPhone(),
                host.getEmail(),
                host.getGender()
        );
    }

}
