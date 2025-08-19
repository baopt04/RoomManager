package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.ContractHistoryProjection;
import com.example.roommanagement.repository.ContractHistoryRepository;
import com.example.roommanagement.service.ContractHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ContractHistoryServiceImpl implements ContractHistoryService {
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    @Override
    public List<ContractHistoryProjection> getAllContractHistory(String idContract) {
        return contractHistoryRepository.getAllContractHistory(idContract);
    }
}
