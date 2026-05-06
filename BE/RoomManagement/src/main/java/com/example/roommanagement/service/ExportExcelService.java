package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.room.HouseMonthlyBillingSummaryDTO;
import com.example.roommanagement.dto.request.room.RoomMonthlyBillingDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ExportExcelService {

    public byte[] exportMonthlyBillingSummary(java.util.List<HouseMonthlyBillingSummaryDTO> dataList) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            for (HouseMonthlyBillingSummaryDTO data : dataList) {
                String originalName = data.getHouseForRentName();
                String safeName = org.apache.poi.ss.util.WorkbookUtil.createSafeSheetName(originalName);
                
                String sheetName = safeName;
                int counter = 1;
                while (workbook.getSheet(sheetName) != null) {
                    String suffix = "(" + counter + ")";
                    if (safeName.length() + suffix.length() > 31) {
                        sheetName = safeName.substring(0, 31 - suffix.length()) + suffix;
                    } else {
                        sheetName = safeName + suffix;
                    }
                    counter++;
                }
                
                Sheet sheet = workbook.createSheet(sheetName);

                // Create styles
                CellStyle titleStyle = createTitleStyle(workbook);
                CellStyle headerStyle = createHeaderStyle(workbook);
                CellStyle dataStyle = createDataStyle(workbook);
                CellStyle currencyStyle = createCurrencyStyle(workbook);

                // Title Row (House Name)
                Row titleRow = sheet.createRow(0);
                Cell titleCell = titleRow.createCell(0);
                titleCell.setCellValue("BẢNG TỔNG HỢP CHI PHÍ: " + data.getHouseForRentName().toUpperCase() + " (Tháng " + data.getMonth() + "/" + data.getYear() + ")");
                titleCell.setCellStyle(titleStyle);
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 14));

                // Header Rows (Shifted by 2 rows because of title)
                Row headerRow1 = sheet.createRow(2);
                Row headerRow2 = sheet.createRow(3);

                String[] headers1 = {"Phòng", "S/L ở", "Giá", "Điện", "", "", "", "Nước", "", "", "", "Wifi", "Dv chung", "Tổng", "Phòng"};
                String[] headers2 = {"", "", "", "Số Cũ", "Số Mới", "Sử Dụng", "Thành Tiền", "Số Cũ", "Số Mới", "Sử Dụng", "Thành Tiền", "", "", "", ""};

                for (int i = 0; i < headers1.length; i++) {
                    Cell cell = headerRow1.createCell(i);
                    cell.setCellValue(headers1[i]);
                    cell.setCellStyle(headerStyle);
                }

                for (int i = 0; i < headers2.length; i++) {
                    Cell cell = headerRow2.createCell(i);
                    cell.setCellValue(headers2[i]);
                    cell.setCellStyle(headerStyle);
                }

                // Merging headers
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 0, 0)); // Phòng
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 1, 1)); // S/L ở
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 2, 2)); // Giá
                sheet.addMergedRegion(new CellRangeAddress(2, 2, 3, 6)); // Điện
                sheet.addMergedRegion(new CellRangeAddress(2, 2, 7, 10)); // Nước
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 11, 11)); // Wifi
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 12, 12)); // Dv chung
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 13, 13)); // Tổng
                sheet.addMergedRegion(new CellRangeAddress(2, 3, 14, 14)); // Phòng (Cuối)

                // Data Rows
                int rowIdx = 4;
                for (RoomMonthlyBillingDTO room : data.getRooms()) {
                    Row row = sheet.createRow(rowIdx++);

                    row.createCell(0).setCellValue(room.getRoomName());
                    row.createCell(1).setCellValue(1); // Placeholder S/L ở
                    
                    // Giá phòng (roomRent)
                    setCellValue(row.createCell(2), room.getRoomRent(), currencyStyle);

                    // Điện
                    setCellValue(row.createCell(3), room.getElectricityNumberFirst(), dataStyle);
                    setCellValue(row.createCell(4), room.getElectricityNumberLast(), dataStyle);
                    setCellValue(row.createCell(5), room.getElectricityUsed(), dataStyle);
                    setCellValue(row.createCell(6), room.getElectricityAmount(), currencyStyle);

                    // Nước
                    setCellValue(row.createCell(7), room.getWaterNumberFirst(), dataStyle);
                    setCellValue(row.createCell(8), room.getWaterNumberLast(), dataStyle);
                    setCellValue(row.createCell(9), room.getWaterUsed(), dataStyle);
                    setCellValue(row.createCell(10), room.getWaterAmount(), currencyStyle);

                    // Wifi & Services
                    setCellValue(row.createCell(11), room.getWifiFee(), currencyStyle);
                    setCellValue(row.createCell(12), room.getGeneralServiceFee(), currencyStyle);
                    setCellValue(row.createCell(13), room.getGrandTotal(), currencyStyle);
                    
                    row.createCell(14).setCellValue(room.getColumnTitle());

                    // Apply style to all cells in row
                    for (int i = 0; i < 15; i++) {
                        if (row.getCell(i).getCellStyle() == workbook.getCellStyleAt(0)) {
                            row.getCell(i).setCellStyle(dataStyle);
                        }
                    }
                }

                // Auto-size columns
                for (int i = 0; i < 15; i++) {
                    sheet.autoSizeColumn(i);
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void setCellValue(Cell cell, Object value, CellStyle style) {
        if (value != null) {
            if (value instanceof Number) {
                cell.setCellValue(((Number) value).doubleValue());
            } else {
                cell.setCellValue(value.toString());
            }
        }
        cell.setCellStyle(style);
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("#,##0"));
        return style;
    }
}
