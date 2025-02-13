package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.CreateContractDTO;
import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.dto.request.contract.UpdateContractDTO;
import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ContractRepository;
import com.example.roommanagement.service.ContractService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractServiceImpl implements ContractService {
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private Generate generate;
    @Override
    public List<FindAllContractDTO> findAll() {
        return contractRepository.findAllContracts();
    }

    @Override
    public Reponse<CreateContractDTO> create(CreateContractDTO createContractDTO) {
        Contract contract = Contract.builder()
                .code(generate.generateCodeContract())
                .dateStart(createContractDTO.getDateStart())
                .dateEnd(createContractDTO.getDateEnd())
                .contractDeponsit(createContractDTO.getContractDeponsit())
                .nextDueDate(createContractDTO.getNextDueDate())
                .status(createContractDTO.getStatus())
                .description(createContractDTO.getDescription())
                .room(createContractDTO.getRoom())
                .houseForRent(createContractDTO.getHouseForRent())
                .admin(createContractDTO.getAdmin())
                .customer(createContractDTO.getCustomer())
                .build();
        contractRepository.save(contract);
        return new Reponse<>(200 , Constrants.CREATE , createContractDTO);
    }

    @Override
    public Reponse<UpdateContractDTO> update(String id, UpdateContractDTO updateContractDTO) {
        Optional<Contract> contract = contractRepository.findById(id);
        if(!contract.isPresent()){
            return new Reponse<>(404 , Constrants.NOT_FOUND , updateContractDTO);
        }
        Contract con = contract.get();
        con.setDateStart(updateContractDTO.getDateStart());
        con.setDateEnd(updateContractDTO.getDateEnd());
        con.setContractDeponsit(updateContractDTO.getContractDeponsit());
        con.setNextDueDate(updateContractDTO.getNextDueDate());
        con.setStatus(updateContractDTO.getStatus());
        con.setRoom(updateContractDTO.getRoom());
        con.setHouseForRent(updateContractDTO.getHouseForRent());
        con.setAdmin(updateContractDTO.getAdmin());
        con.setCustomer(updateContractDTO.getCustomer());
        contractRepository.save(con);
        return new Reponse<>(200 , Constrants.UPDATE , updateContractDTO);
    }
}
