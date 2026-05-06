package com.example.roommanagement.service;

import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.dto.request.room.*;

import java.util.List;

public interface RoomService {
    List<FindAllRoomDTO> findAllRooms();
    CreateRoomDTO createRoom(CreateRoomDTO createRoomDTO);
    UpdateRoomDTO updateRoom(String id ,UpdateRoomDTO updateRoomDTO  );
    FindAllRoomDTO findCustomerAndHouseForRent(String customer ,String houseForRent);
    BaseRoomDTO detailRoom(String id);
    List<FindAllRoomProjection> findAllRoomNoPayment(Integer mother , Integer year);
    RoomDetailProjection findTotalPriceRoom(String id);
    List<FindAllImageProjection> findAllImagesForRoom(String id);
    List<FindAllRoomDTO> findAllHouseForRentAndCustomer(String idHouseForRent, String idCustomer);
    List<FindAllRoomHistoryProjection> findAllRoomHistory(String idRoom);
    List<RoomStatusCountProjection> getAllStatusRoom();
    List<FindAllRoomDTO> findAllRoomByCustomer(String idCustomer);

    /**
     * Tổng hợp tiền điện, nước, dịch vụ và tiền phòng của mọi phòng thuộc một nhà trong tháng/năm (xuất Excel).
     */
    HouseMonthlyBillingSummaryDTO getHouseMonthlyBillingSummary(String houseForRentId, Integer month, Integer year);

    /**
     * Tổng hợp cho tất cả các nhà.
     */
    java.util.List<HouseMonthlyBillingSummaryDTO> getAllHousesMonthlyBillingSummary(Integer month, Integer year);
}
