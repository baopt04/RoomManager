package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.Image;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.ExportExcelService;
import com.example.roommanagement.service.RoomService;
import org.hibernate.annotations.processing.Find;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/room")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @Autowired
    private ExportExcelService exportExcelService;
    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllRoomDTO>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllRoomDTO> list = roomService.findAllRooms(pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping(value = "/create" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateRoomDTO> create(@ModelAttribute CreateRoomDTO createRoomDTO) {
        CreateRoomDTO reponse = roomService.createRoom(createRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @PutMapping(value = "/update/{id}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UpdateRoomDTO> update(@PathVariable String id ,@ModelAttribute UpdateRoomDTO updateRoomDTO) {
        UpdateRoomDTO reponse = roomService.updateRoom(id, updateRoomDTO);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/getCustomerAndHouseForRent")
    public ResponseEntity<FindAllRoomDTO> getCustomerAndHouseForRent(@RequestParam("customer") String customer ,
                                                                              @RequestParam("houseForRent") String houseForRent) {
        FindAllRoomDTO reponse = roomService.findCustomerAndHouseForRent(customer, houseForRent);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseRoomDTO> detail(@PathVariable String id) {
        BaseRoomDTO reponse = roomService.detailRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/findByRoomNoPayMent")
    public ResponseEntity<List<FindAllRoomProjection>> findByRoomNoPayMent(@RequestParam("mother")Integer mother , @RequestParam("year")Integer year) {
        List<FindAllRoomProjection> list = roomService.findAllRoomNoPayment(mother , year);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @GetMapping("/findTotalPriceRoom")
    public ResponseEntity<RoomDetailProjection> findTotalPriceRoom(@RequestParam("id") String id) {
        RoomDetailProjection reponse = roomService.findTotalPriceRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }

    /**
     * Bảng tổng hợp theo nhà: mỗi phòng một cột dữ liệu (điện, nước, dịch vụ tách loại, tiền nhà, tổng) — phục vụ xuất Excel.
     */
    @GetMapping("/monthly-billing-summary")
    public ResponseEntity<HouseMonthlyBillingSummaryDTO> getMonthlyBillingSummary(
            @RequestParam("houseForRentId") String houseForRentId,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "year", required = false) Integer year) {
        HouseMonthlyBillingSummaryDTO response = roomService.getHouseMonthlyBillingSummary(houseForRentId, month, year);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/export-monthly-billing")
    public ResponseEntity<byte[]> exportMonthlyBilling(
            @RequestParam(value = "houseForRentId", required = false) String houseForRentId,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "year", required = false) Integer year) throws IOException {
        
        List<HouseMonthlyBillingSummaryDTO> summaries;
        String fileName;

        if (houseForRentId == null || houseForRentId.isEmpty() || houseForRentId.equalsIgnoreCase("all")) {
            summaries = roomService.getAllHousesMonthlyBillingSummary(month, year);
            fileName = "Bang_Ke_Tong_Hop_Thang_" + (month != null ? month : "") + "_" + (year != null ? year : "") + ".xlsx";
        } else {
            HouseMonthlyBillingSummaryDTO data = roomService.getHouseMonthlyBillingSummary(houseForRentId, month, year);
            summaries = List.of(data);
            fileName = "Bang_Ke_" + data.getHouseForRentName().replace(" ", "_") + "_Thang_" + data.getMonth() + "_" + data.getYear() + ".xlsx";
        }

        byte[] excelContent = exportExcelService.exportMonthlyBillingSummary(summaries);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelContent);
    }
    @GetMapping("/findAllImages/{id}")
    public ResponseEntity<List<FindAllImageProjection>> findAllImageForRoom(@PathVariable String id) {
        List<FindAllImageProjection> reponse = roomService.findAllImagesForRoom(id);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/findAllHouseForRent")
    public ResponseEntity<List<FindAllRoomDTO>> findAllHouseForRent(
            @RequestParam(required = false) String idHouseForRent,
            @RequestParam(required = false) String idCustomer) {

        List<FindAllRoomDTO> response = roomService.findAllHouseForRentAndCustomer(idHouseForRent, idCustomer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/findAllRoomHistory")
    public ResponseEntity<List<FindAllRoomHistoryProjection>> findAllRoomHistory(@RequestParam("idRoom")String idRoom) {
        List<FindAllRoomHistoryProjection> response = roomService.findAllRoomHistory(idRoom);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/getAllStatus")
    public ResponseEntity<List<RoomStatusCountProjection>> getAllStatus() {
        List<RoomStatusCountProjection> response = roomService.getAllStatusRoom();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/findByIdCustomer/{idCustomer}")
    public ResponseEntity<List<FindAllRoomDTO>> getByIdCustomer(@PathVariable String idCustomer) {
        List<FindAllRoomDTO> response = roomService.findAllRoomByCustomer(idCustomer);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
