package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.bill.*;
import com.example.roommanagement.dto.request.billDetail.BillDetailProjection;
import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.constant.*;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.*;
import com.example.roommanagement.service.BillService;
import com.example.roommanagement.service.EmailService;
import com.example.roommanagement.service.RoomHistoryService;
import com.example.roommanagement.util.Generate;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private BillDetailRepository billDetailRepository;
    @Autowired
    private ElectricityRepository electricityRepository;
    @Autowired
    private WaterRepository waterRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;
    @Autowired
    private RoomHistoryRepository roomHistoryRepository;

    @Override
    public List<FindAllBillProjection> findAllBills() {
        return billRepository.findAllBills();
    }

    @Override
    public List<FindAllBillProjection> findAllBillNoCreateBills() {
        return billRepository.findAllBillNoCreateBill();
    }

    @Override
    public Bill createBill(String id) {
        Optional<Admin> optional = adminRepository.findById(id);
        if (!optional.isPresent()) {
            throw new BusinessException(Constrants.ADMIN_FOUND);
        }
        String code = generate.generateCodeBill();
        while (billRepository.existsByCode(code)) {
            code = generate.generateCodeBill();
        }
        Bill bill = Bill.builder()
                .code(code)
                .totalRoom(BigDecimal.ZERO)
                .totalRoomService(BigDecimal.ZERO)
                .totalPriceWater(BigDecimal.ZERO)
                .totalPriceElectricity(BigDecimal.ZERO)
                .totalAmonut(BigDecimal.ZERO)
                .amountPaid(BigDecimal.ZERO)
                .electricityUsage(BigDecimal.ZERO)
                .waterUsage(BigDecimal.ZERO)
                .motherPay(null)
                .paidDate(null)
                .dueDate(null)
                .dateCreate(new Date())
                .status(StatusBill.CHUA_THANH_TOAN)
                .description(null)
                .admin(optional.get())
                .build();
        billRepository.save(bill);
        return bill;
    }

    @Override
    @Transactional
    public CreateBillDTO createBillForCustomer(String id, CreateBillDTO request) {
        Optional<Bill> optional = billRepository.findById(id);
        if (!optional.isPresent()) {
            throw new BusinessException(Constrants.BILL_NOT_FOUND);
        }
        Optional<Room> optionalRoom = roomRepository.findById(request.getRoomId());
        if (!optionalRoom.isPresent()) {
            throw new BusinessException(Constrants.ROOM_FOUND);
        }
        Optional<Customer> optionalCustomer = customerRepository.findById(request.getCustomerId());
        if (!optionalCustomer.isPresent()) {
            throw new BusinessException(Constrants.CUSTOMER_FOUND);
        }
        Optional<Contract> optionalContract = contractRepository.findTopByRoomIdOrderByLastModifiedDateDesc((request.getRoomId()));
        if (!optionalContract.isPresent()) {
            throw new BusinessException(Constrants.CONTRACT_NOT_FOUND);
        }
        Optional<Water> optionalWater = waterRepository.findTopByRoomIdOrderByLastModifiedDateDesc(request.getRoomId());
        if (!optionalWater.isPresent()) {
            throw new BusinessException(Constrants.WATER_NOT_FOUND);
        }
        Optional<Electricity> optionalElectricity = electricityRepository.findTopByRoomIdOrderByLastModifiedDateDesc(request.getRoomId());
        if (!optionalElectricity.isPresent()) {
            throw new BusinessException(Constrants.ELECTRICITY_NOT_FOUND);
        }
        Water water = optionalWater.get();
        Electricity electricity = optionalElectricity.get();
        Contract contract = optionalContract.get();
        String emailCustomer = optionalCustomer.get().getEmail();
        LocalDateTime localDateTime = LocalDateTime.now();
        Integer motherPay = localDateTime.getMonthValue();
        Integer yearPay = localDateTime.getYear();
        Bill bill = optional.get();
        bill.setTotalRoom(request.getTotalRoom());
        bill.setTotalRoomService(request.getTotalRoomService());
        bill.setTotalPriceElectricity(request.getTotalPriceElectricity());
        bill.setTotalPriceWater(request.getTotalPriceWater());
        bill.setTotalAmonut(request.getTotalAmonut());
        bill.setElectricityUsage(request.getElectricityUsage());
        bill.setWaterUsage(request.getWaterUsage());
        bill.setMotherPay(motherPay);
        bill.setYearPay(yearPay);
        bill.setDueDate(request.getDueDate());
        bill.setDescription(request.getDescription());
        bill.setStatus(StatusBill.CHUA_THANH_TOAN);
        bill.setDateCreate(new Date());
        bill.setRoom(optionalRoom.get());
        bill.setCustomer(optionalCustomer.get());
        bill.setContract(contract);
        billRepository.save(bill);
        electricity.setStatus(StatusWaterEndElectric.DA_THANH_TOAN);
        water.setStatus(StatusWaterEndElectric.DA_THANH_TOAN);
        electricityRepository.save(electricity);
        waterRepository.save(water);
        BigDecimal totalPriceWater = request.getTotalPriceWater();
        BigDecimal totalWaterUse = request.getWaterUsage();
        BigDecimal unitPriceWater = totalPriceWater.divide(totalWaterUse, 2, RoundingMode.HALF_UP);
        BigDecimal totalPriceElectricity = request.getTotalPriceElectricity();
        BigDecimal totalElectricityUse = request.getElectricityUsage();
        BigDecimal unitPriceElectricity = totalPriceElectricity.divide(totalElectricityUse, 2, RoundingMode.HALF_UP);
        billDetailRepository.deleteBillDetailByBillId(id);
        billDetailRepository.saveAll(List.of(
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.DIEN)
                                .quantity(request.getElectricityUsage())
                                .unitPrice(unitPriceElectricity)
                                .amount(request.getTotalPriceElectricity())
                                .description("BillDetail điện")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.NUOC)
                                .quantity(request.getWaterUsage())
                                .unitPrice(unitPriceWater)
                                .amount(request.getTotalPriceWater())
                                .description("BillDetail nươcs")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.DICH_VU)
                                .unitPrice(request.getTotalRoomService())
                                .amount(request.getTotalRoomService())
                                .description("BillDetail dịch vụ")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.TIEN_PHONG)
                                .quantity(BigDecimal.valueOf(1))
                                .unitPrice(request.getTotalRoom())
                                .amount(request.getTotalRoom())
                                .description("BillDetail tiền phòng")
                                .build()
                )
        );
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        Date startDate = calendar.getTime();

        calendar.add(Calendar.MONTH, 1);
        Date endDate = calendar.getTime();
        if (!roomHistoryRepository.existsByRoom_IdAndStartDateAndEndDate(optionalRoom.get().getId(), startDate, endDate) || request.getIsHistory()) {
            RoomHistory roomHistory = RoomHistory.builder()
                    .room(optionalRoom.get())
                    .customer(optionalCustomer.get())
                    .startDate(startDate)
                    .endDate(endDate)
                    .price(request.getTotalRoom())
                    .status(StatusRoomHistory.DANG_CHO_THUE)
                    .isPaid(false)
                    .build();
            roomHistoryRepository.save(roomHistory);
        }

        if (emailCustomer != null) {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateNow = formatter.format(new Date());
            String htmlBody = emailService.generateEmailBody(bill);
            emailService.sendMailAsync(emailCustomer, "Hóa đơn thanh toán tiền trọ ngày :" + dateNow, htmlBody);
        }

        return request;

    }

    @Override
    @Transactional
    public UpdateBillDTO updateBillForCustomer(String id, UpdateBillDTO request) {
        Optional<Bill> optional = billRepository.findById(id);
        if (!optional.isPresent()) {
            throw new BusinessException(Constrants.BILL_NOT_FOUND);
        }
        Optional<Room> optionalRoom = roomRepository.findById(request.getRoomId());
        if (!optionalRoom.isPresent()) {
            throw new BusinessException(Constrants.ROOM_FOUND);
        }
        Optional<Customer> optionalCustomer = customerRepository.findById(request.getCustomerId());
        if (!optionalCustomer.isPresent()) {
            throw new BusinessException(Constrants.CUSTOMER_FOUND);
        }
        Optional<Contract> optionalContract = contractRepository.findTopByRoomIdOrderByLastModifiedDateDesc((request.getRoomId()));
        if (!optionalContract.isPresent()) {
            throw new BusinessException(Constrants.CONTRACT_NOT_FOUND);
        }
        Optional<Water> optionalWater = waterRepository.findTopByRoomIdOrderByLastModifiedDateDesc(request.getRoomId());
        if (!optionalWater.isPresent()) {
            throw new BusinessException(Constrants.WATER_NOT_FOUND);
        }
        Optional<Electricity> optionalElectricity = electricityRepository.findTopByRoomIdOrderByLastModifiedDateDesc(request.getRoomId());
        if (!optionalElectricity.isPresent()) {
            throw new BusinessException(Constrants.ELECTRICITY_NOT_FOUND);
        }
        Water water = optionalWater.get();
        Electricity electricity = optionalElectricity.get();
        Contract contract = optionalContract.get();
        String emailCustomer = optionalCustomer.get().getEmail();
        LocalDateTime localDateTime = LocalDateTime.now();
        Integer motherPay = localDateTime.getMonthValue();
        Integer yearPay = localDateTime.getYear();
        BigDecimal amountPaid = BigDecimal.ZERO;
        Date paidDate = null;
        if (request.getStatus() == StatusBill.DA_THANH_TOAN) {
            amountPaid = request.getTotalAmonut();
            paidDate = request.getDueDate();
        }
        Bill bill = optional.get();
        bill.setTotalRoom(request.getTotalRoom());
        bill.setTotalRoomService(request.getTotalRoomService());
        bill.setTotalPriceElectricity(request.getTotalPriceElectricity());
        bill.setTotalPriceWater(request.getTotalPriceWater());
        bill.setTotalAmonut(request.getTotalAmonut());
        bill.setAmountPaid(amountPaid);
        bill.setPaidDate(paidDate);
        bill.setElectricityUsage(request.getElectricityUsage());
        bill.setWaterUsage(request.getWaterUsage());
        bill.setMotherPay(motherPay);
        bill.setYearPay(yearPay);
        bill.setDueDate(request.getDueDate());
        bill.setDescription(request.getDescription());
        bill.setStatus(request.getStatus());
        bill.setDateCreate(new Date());
        bill.setRoom(optionalRoom.get());
        bill.setCustomer(optionalCustomer.get());
        bill.setContract(contract);
        billRepository.save(bill);
        electricity.setStatus(StatusWaterEndElectric.DA_THANH_TOAN);
        water.setStatus(StatusWaterEndElectric.DA_THANH_TOAN);
        electricityRepository.save(electricity);
        waterRepository.save(water);
        BigDecimal totalPriceWater = request.getTotalPriceWater();
        BigDecimal totalWaterUse = request.getWaterUsage();
        BigDecimal unitPriceWater = totalPriceWater.divide(totalWaterUse, 2, RoundingMode.HALF_UP);
        BigDecimal totalPriceElectricity = request.getTotalPriceElectricity();
        BigDecimal totalElectricityUse = request.getElectricityUsage();
        BigDecimal unitPriceElectricity = totalPriceElectricity.divide(totalElectricityUse, 2, RoundingMode.HALF_UP);
        billDetailRepository.deleteBillDetailByBillId(id);
        billDetailRepository.saveAll(List.of(
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.DIEN)
                                .quantity(request.getElectricityUsage())
                                .unitPrice(unitPriceElectricity)
                                .amount(request.getTotalPriceElectricity())
                                .description("BillDetail điện")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.NUOC)
                                .quantity(request.getWaterUsage())
                                .unitPrice(unitPriceWater)
                                .amount(request.getTotalPriceWater())
                                .description("BillDetail nươcs")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.DICH_VU)
                                .unitPrice(request.getTotalRoomService())
                                .amount(request.getTotalRoomService())
                                .description("BillDetail dịch vụ")
                                .build(),
                        BillDetail.builder()
                                .bill(bill)
                                .type(TypeBillDetail.TIEN_PHONG)
                                .quantity(BigDecimal.valueOf(1))
                                .unitPrice(request.getTotalRoom())
                                .amount(request.getTotalRoom())
                                .description("BillDetail tiền phòng")
                                .build()
                )
        );

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .bill(bill)
                .customer(optionalCustomer.get())
                .paymentDate(new Date())
                .amount(request.getAmountPaid())
                .method(StatusMethod.valueOf(request.getMethod()))
                .description("Payment check")
                .isRefund(false)
                .build();
        paymentHistoryRepository.save(paymentHistory);

        System.out.println("Check email customer" + emailCustomer);
        if (emailCustomer != null) {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            String dateNow = formatter.format(new Date());
            String htmlBody = emailService.generateEmailBody(bill);
            emailService.sendMailAsync(emailCustomer, "Cập nhật hóa đơn phòng trọ mới nhất ngày :" + dateNow, htmlBody);
        }

        return request;
    }

    @Override
    public List<BillDetailProjection> findAllBillDetails() {
        return billDetailRepository.finAllBillDetails();
    }

    @Override
    public FindAllBillProjection detailBill(String id) {
        FindAllBillProjection bill = billRepository.detailBill(id);
        return bill;
    }

    @Override
    public List<BillDetailProjection> detailBillDetail(String id) {
        List<BillDetailProjection> billDetail = billDetailRepository.detailBillDetail(id);
        return billDetail;
    }


}
