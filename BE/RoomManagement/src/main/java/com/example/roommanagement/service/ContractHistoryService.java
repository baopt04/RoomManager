package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.contract.ContractHistoryProjection;

import java.util.List;

public interface ContractHistoryService {
    List<ContractHistoryProjection> getAllContractHistory(String idContract);
}
