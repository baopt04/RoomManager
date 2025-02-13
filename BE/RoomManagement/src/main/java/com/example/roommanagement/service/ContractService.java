package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.contract.CreateContractDTO;
import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.dto.request.contract.UpdateContractDTO;
import com.example.roommanagement.infrastructure.error.Reponse;

import java.util.List;

public interface ContractService {
    List<FindAllContractDTO> findAll();
    Reponse<CreateContractDTO> create(CreateContractDTO createContractDTO);
    Reponse<UpdateContractDTO> update(String id ,UpdateContractDTO updateContractDTO);

}
