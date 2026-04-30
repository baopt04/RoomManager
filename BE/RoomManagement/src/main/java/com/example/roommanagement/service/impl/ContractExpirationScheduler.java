package com.example.roommanagement.service.impl;

import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.repository.ContractRepository;
import com.example.roommanagement.service.TelegramService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Component
@Slf4j
public class ContractExpirationScheduler {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private TelegramService telegramService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    private final NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    // Chạy vào 8:00 sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
//    @Scheduled(cron = "0 * * * * ?")
    public void checkContractExpiration() {
        log.info("Bắt đầu kiểm tra hợp đồng hết hạn ngày hôm nay...");
        Date today = new Date();
        List<Contract> expiringContracts = contractRepository.findByDateEnd(today);

        if (expiringContracts.isEmpty()) {
            log.info("Không có hợp đồng nào hết hạn vào ngày hôm nay.");
            return;
        }

        for (Contract contract : expiringContracts) {
            sendNotification(contract, "🔔 THÔNG BÁO HẾT HẠN HỢP ĐỒNG");
        }
    }

    // Chạy vào 8:00 sáng ngày 1 hàng tháng
    @Scheduled(cron = "0 0 8 1 * ?")
//        @Scheduled(cron = "0 * * * * ?")
    public void checkMonthlyContractExpiration() {
        log.info("Bắt đầu kiểm tra hợp đồng hết hạn trong tháng này...");
        java.util.Calendar cal = java.util.Calendar.getInstance();
        int month = cal.get(java.util.Calendar.MONTH) + 1;
        int year = cal.get(java.util.Calendar.YEAR);

        List<Contract> expiringContracts = contractRepository.findByMonthAndYear(month, year);

        if (expiringContracts.isEmpty()) {
            log.info("Không có hợp đồng nào hết hạn trong tháng {}/{}.", month, year);
            return;
        }

        StringBuilder message = new StringBuilder();
        message.append("<b>📋 DANH SÁCH HỢP ĐỒNG HẾT HẠN TRONG THÁNG ").append(month).append("/").append(year).append("</b>\n\n");
        for (Contract contract : expiringContracts) {
            message.append("▪️ <b>Phòng:</b> ").append(contract.getRoom() != null ? contract.getRoom().getName() : "N/A").append("\n");
            message.append(" - <b>Hết hạn:</b> ").append(contract.getDateEnd() != null ? dateFormat.format(contract.getDateEnd()) : "N/A").append("\n");
            message.append(" - <b>Khách hàng:</b> ").append(contract.getCustomer() != null ? contract.getCustomer().getName() : "N/A").append("\n");
            message.append(" - <b>Tiền cọc:</b> ").append(contract.getContractDeponsit() != null ? currencyFormat.format(contract.getContractDeponsit()) : "0 VNĐ").append("\n");
            message.append("\n");
        }
        message.append("\n<i>Vui lòng lên kế hoạch xử lý gia hạn hoặc thanh lý.</i>");

        telegramService.sendMessage(message.toString());
        log.info("Đã gửi danh sách hợp đồng hết hạn trong tháng {}/{}", month, year);
    }

    private void sendNotification(Contract contract, String title) {
        StringBuilder message = new StringBuilder();
        message.append("<b>").append(title).append("</b>\n\n");
        message.append("<b>Mã hợp đồng:</b> ").append(contract.getCode()).append("\n");
        message.append("<b>Phòng:</b> ").append(contract.getRoom() != null ? contract.getRoom().getName() : "N/A").append("\n");
        message.append("<b>Khách hàng:</b> ").append(contract.getCustomer() != null ? contract.getCustomer().getName() : "N/A").append("\n");
        message.append("<b>Ngày bắt đầu:</b> ").append(contract.getDateStart() != null ? dateFormat.format(contract.getDateStart()) : "N/A").append("\n");
        message.append("<b>Ngày hết hạn:</b> ").append(contract.getDateEnd() != null ? dateFormat.format(contract.getDateEnd()) : "N/A").append("\n");
        message.append("<b>Tiền cọc:</b> ").append(contract.getContractDeponsit() != null ? currencyFormat.format(contract.getContractDeponsit()) : "0 VNĐ").append("\n\n");
        message.append("<i>Vui lòng kiểm tra và xử lý gia hạn hoặc thanh lý hợp đồng.</i>");

        telegramService.sendMessage(message.toString());
        log.info("Đã gửi thông báo cho hợp đồng: {}", contract.getCode());
    }
}
