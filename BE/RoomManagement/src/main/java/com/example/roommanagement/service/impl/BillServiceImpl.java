package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.bill.CreateBillDTO;
import com.example.roommanagement.dto.request.bill.FindAllBillDTO;
import com.example.roommanagement.dto.request.bill.UpdateBillDTO;
import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusWaterEndElectric;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.*;
import com.example.roommanagement.service.BillService;
import com.example.roommanagement.util.Generate;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BillServiceImpl implements BillService {
    @Override
    public List<FindAllBillDTO> findAllBills() {
        return billRepository.findAllBill();
    }

    @Override
    @Transactional
    public Reponse<CreateBillDTO> create(String id_room, CreateBillDTO createBillDTO) {
        List<Object[]> listPrice = roomRepository.getTotalPriceForRoom(id_room);
        if (listPrice.isEmpty()) {
            return new Reponse<>(200, Constrants.NOT_FOUND_ID_BILL, null);
        }
        List<Object[]> idContract = contractRepository.findIdContract(id_room);
        if (idContract.isEmpty()) {
            return new Reponse<>(200, Constrants.NOT_FOUND_ID_BILL, null);
        }
        Object[] row1 = idContract.get(0);
        String id_contract = (String) row1[0];
        Object[] row = listPrice.get(0);
        BigDecimal totalPriceService = (BigDecimal) row[0];
        BigDecimal totalPriceWater = (BigDecimal) row[1];
        BigDecimal totalPriceElectricity = (BigDecimal) row[2];
        String idCustomer = (String) row[3];
        BigDecimal totalPrice = totalPriceService.add(totalPriceWater).add(totalPriceElectricity);
        Customer customer = customerRepository.findById(idCustomer).orElseThrow(() ->
                new RuntimeException("Customer not found"));
        Contract contract = contractRepository.findById(id_contract).orElseThrow(() ->
                new RuntimeException("Contract not found"));
        Bill bill = Bill.builder()
                .code(generate.generateCodeBill())
                .totalPriceService(totalPriceService)
                .totalPriceWater(totalPriceWater)
                .totalPriceElectricity(totalPriceElectricity)
                .paymnetDate(createBillDTO.getPaymentDate())
                .totalPrice(totalPrice)
                .status(createBillDTO.getStatus())
                .room(createBillDTO.getRoom())
                .customer(customer)
                .contract(contract)
                .build();
        billRepository.save(bill);
        electricityRepository.updateElectricityStatus(id_room);
        waterRepository.updateWaterStatus(id_room);

        return new Reponse<>(200, Constrants.CREATE, createBillDTO);
    }

    @Override
    public Reponse<UpdateBillDTO> update(String id, UpdateBillDTO updateBillDTO) {
        Optional<Bill> idBill = billRepository.findById(id);
        if (!idBill.isPresent()) {
            return new Reponse<>(404 , Constrants.NOT_FOUND , null);
        }
        Bill bill = idBill.get();
return null;
    }

    @Autowired
    private BillRepository billRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private ElectricityRepository electricityRepository;
    @Autowired
    private WaterRepository waterRepository;
    @Autowired
    private Generate generate;

}
