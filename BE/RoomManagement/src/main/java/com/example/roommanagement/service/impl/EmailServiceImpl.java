package com.example.roommanagement.service.impl;

import com.example.roommanagement.entity.Bill;
import com.example.roommanagement.infrastructure.constant.StatusBill;
import com.example.roommanagement.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Override
    public void sendMail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            javaMailSender.send(message);
            ClassPathResource qrImage = new ClassPathResource("static/images/QrPay.png");
            if (qrImage.exists()) {
                helper.addInline("qrCodeImage", qrImage);
            } else {
                System.err.println("QR code image not found in classpath.");
            }

            System.out.println("Mail sent successfully to " + to);
        } catch (MessagingException e) {
            System.err.println("Failed to send mail: " + e.getMessage());
            throw e;
        }
        }
    private String formatCurrency(BigDecimal money) {
        DecimalFormat formatter = new DecimalFormat("#,###₫");
        return formatter.format(money);
    }

    @Override
    public String generateEmailBody(Bill bill) {
        StringBuilder htmlBody = new StringBuilder();
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String createDateFormat = formatter.format(bill.getDateCreate());
        String dueDateFormat = formatter.format(bill.getDueDate());

        BigDecimal totalPriceWater = bill.getTotalPriceWater();
        BigDecimal totalWaterUse = bill.getWaterUsage();
        BigDecimal totalPriceElectricity = bill.getTotalPriceElectricity();
        BigDecimal totalElectricityUse = bill.getElectricityUsage();

        BigDecimal unitPriceWater = BigDecimal.ZERO;
        BigDecimal unitPriceElectricity = BigDecimal.ZERO;
        if (totalWaterUse.compareTo(BigDecimal.ZERO) > 0) {
            unitPriceWater = totalPriceWater.divide(totalWaterUse, 2, RoundingMode.HALF_UP);
        }
        if (totalElectricityUse.compareTo(BigDecimal.ZERO) > 0) {
            unitPriceElectricity = totalPriceElectricity.divide(totalElectricityUse, 2, RoundingMode.HALF_UP);
        }

        String statusBill = bill.getStatus() == StatusBill.CHUA_THANH_TOAN ? "Chưa thanh toán" : "Đã thanh toán";

        htmlBody.append("<html><head><style>")
                .append("body { font-family: Arial, sans-serif; }")
                .append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }")
                .append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }")
                .append("th { background-color: #f2f2f2; }")
                .append(".total-row td { font-weight: bold; }")
                .append("</style></head><body>")

                .append("<h2>Thông tin hóa đơn thanh toán tiền trọ</h2>")
                .append("<p><strong>Mã hóa đơn:</strong> ").append(bill.getCode()).append("</p>")
                .append("<p><strong>Tên phòng:</strong> ").append(bill.getRoom().getName()).append("</p>")
                .append("<p><strong>Ngày tạo:</strong> ").append(createDateFormat).append("</p>")
                .append("<p style=\"color:red;\"><strong>Trạng thái:</strong> ").append(statusBill).append("</p>")

                .append("<table>")
                .append("<tr><th>STT</th><th>Loại chi phí</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr>")

                // Tiền phòng
                .append("<tr><td>1</td><td>Tiền phòng</td><td>1</td>")
                .append("<td>").append(formatCurrency(bill.getTotalRoom())).append("</td>")
                .append("<td>").append(formatCurrency(bill.getTotalRoom())).append("</td></tr>")

                // Nước
                .append("<tr><td>2</td><td>Nước</td><td>").append(totalWaterUse).append(" m³</td>")
                .append("<td>").append(formatCurrency(unitPriceWater)).append("</td>")
                .append("<td>").append(formatCurrency(totalPriceWater)).append("</td></tr>")

                // Điện
                .append("<tr><td>3</td><td>Điện</td><td>").append(totalElectricityUse).append(" kWh</td>")
                .append("<td>").append(formatCurrency(unitPriceElectricity)).append("</td>")
                .append("<td>").append(formatCurrency(totalPriceElectricity)).append("</td></tr>")

                // Dịch vụ
                .append("<tr><td>4</td><td>Dịch vụ</td><td>1</td>")
                .append("<td>").append(formatCurrency(bill.getTotalRoomService())).append("</td>")
                .append("<td>").append(formatCurrency(bill.getTotalRoomService())).append("</td></tr>")

                // Tổng cộng
                .append("<tr class='total-row'><td colspan='4'>Tổng cộng</td>")
                .append("<td>").append(formatCurrency(bill.getTotalAmonut())).append("</td></tr>")
                .append("</table>")

                .append("<p><strong>Thông tin chuyển khoản:</strong></p>")
                .append("<p>Tên tài khoản: Nguyễn Tiến Đức</p>")
                .append("<p>Số tài khoản: 123456789</p>")
                .append("<p>Ngân hàng: Vietcombank - Chi nhánh Hà Nội</p>")
                .append("<p>Ghi chú: Vui lòng ghi rõ mã hóa đơn khi chuyển khoản</p>")

                // Chèn mã QR
                .append("<p><strong>Hoặc quét mã QR để thanh toán:</strong></p>")
                .append("<img src=\"cid:qrCodeImage\" alt=\"QR Code\" width=\"200\" height=\"200\" />")

                .append("<p style=\"color:red;\">Vui lòng thanh toán trước ngày: ").append(dueDateFormat).append("</p>")
                .append("<p><em>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</em></p>")
                .append("</body></html>");

        return htmlBody.toString();
    }

    public void sendMailCreateAmdin(String to , String subject , String content) throws MailException, MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage );
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(content);
//        mimeMessageHelper.setFrom("phamthaibao2410@gmail.com");
        javaMailSender.send(mimeMessage);


    }
}
