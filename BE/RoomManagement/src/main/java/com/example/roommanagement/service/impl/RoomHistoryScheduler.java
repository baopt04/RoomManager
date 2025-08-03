package com.example.roommanagement.service.impl;

import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.entity.RoomHistory;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusRoomHistory;
import com.example.roommanagement.repository.ContractRepository;
import com.example.roommanagement.repository.RoomHistoryRepository;
import com.example.roommanagement.service.RoomHistoryService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class RoomHistoryScheduler implements RoomHistoryService {
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private RoomHistoryRepository roomHistoryRepository;

    @Override
    @Transactional
    @Scheduled(cron = "0 */1 * * * ?") // chạy mỗi phút (đang test)
    public void generateRoomHistory() {
//        List<Contract> contracts = contractRepository.findByStatus(StatusContract.KICH_HOAT);
//        System.out.println("Check t contract " + contracts.size());
//
//        LocalDate toDay = LocalDate.now();
//
//        for (Contract contract : contracts) {
//            if (contract.getNextDueDate() == null || contract.getDateEnd() == null) {
//                System.out.println("⚠️ Contract " + contract.getId() + " thiếu ngày nextDueDate hoặc dateEnd, bỏ qua.");
//                continue;
//            }
//
//            LocalDate dueDate = toLocalDate(contract.getNextDueDate());
//            LocalDate endDate = toLocalDate(contract.getDateEnd());
//
//            if (toDay.getDayOfMonth() == dueDate.getDayOfMonth() && !dueDate.isAfter(endDate)) {
//                int month = dueDate.getMonthValue();
//                int year = dueDate.getYear();
//                System.out.println("Check iod" + contract.getRoom().getId());
//                System.out.println("Check month " + month + " year " + year);
//
//                boolean exists = roomHistoryRepository.existsByRoomAndMonthAndYear(
//                        contract.getRoom().getId(), month, year);
//                System.out.println("Check exists" + exists);
//                if (!exists) {
//                    LocalDate start = dueDate;
//                    LocalDate end = dueDate.plusMonths(1);
//
//                    RoomHistory rh = RoomHistory.builder()
//                            .room(contract.getRoom())
//                            .customer(contract.getCustomer())
//                            .price(contract.getRoom().getPrice())
//                            .startDate(converToDate(start))
//                            .endDate(converToDate(end))
//                            .status(StatusRoomHistory.DANG_CHO_THUE)
//                            .isPaid(false)
//                            .build();
//
//                    roomHistoryRepository.save(rh);
//
//                    System.out.println("✅ Đã tạo RoomHistory cho contract: " + contract.getId());
//                } else {
//                    System.out.println("ℹ️ Đã tồn tại RoomHistory cho tháng " + month + "/" + year);
//                }
//            }
//        }
        return ;
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
    private Date converToDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
