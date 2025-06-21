package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.room.FindAllRoomDTO;
import com.example.roommanagement.dto.request.room.FindAllRoomProjection;
import com.example.roommanagement.dto.request.room.ListPriceRoom;
import com.example.roommanagement.dto.request.room.RoomDetailProjection;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findById(String id);
Boolean existsByName(String name);
    @Query(value = """
            SELECT 
            ROW_NUMBER() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id, 
            r.code as code ,
            r.name as name , 
            r.price as price , 
            r.acreage as acreage ,
            r.people_Max as peopleMax ,
            r.decription as description ,
            r.type as type , 
            r.status as status ,
            r.id_customer as customer ,
            r.id_house_for_rent as houseForRent
            FROM Room r
            """, nativeQuery = true)
    List<FindAllRoomDTO> findRoom();

    @Query(value = """
    SELECT 
        ROW_NUMBER() OVER (ORDER BY r.last_modified_date DESC) AS stt,
        r.id AS id,
        r.code AS code,
        r.name AS name,
        r.price AS price,
        r.acreage AS acreage,
        r.people_Max AS peopleMax,
        r.decription AS description,
        r.type AS type,
        r.status AS status,
        r.id_customer AS customer,
        r.id_house_for_rent AS houseForRent
    FROM Room r
    WHERE 
        (:houseForRentId IS NULL OR r.id_house_for_rent = :houseForRentId)
        AND (:customerId IS NULL OR r.id_customer = :customerId)
    """, nativeQuery = true)
    List<FindAllRoomDTO> findAllRoomsByHouseForRentAndCustomer(
            @Param("houseForRentId") String houseForRentId,
            @Param("customerId") String customerId
    );


    @Query(value = """
            SELECT 
             ROW_NUMBER() over(order by r.last_modified_date desc ) as stt ,
             r.id as id ,
                  r.code as code ,
                        r.name as name , 
                        r.price as price , 
                        r.acreage as acreage ,
                        r.people_Max as peopleMax ,
                        r.decription as description ,
                         r.type as type , 
                        r.status as status ,
                        r.id_customer as customer ,
                        r.id_house_for_rent as houseForRent
             from Room r 
             WHERE 
             (:customer IS NULL OR r.id_customer LIKE %:customer%)
             AND (:houseForRent IS NULL OR r.id_house_for_rent LIKE %:houseForRent%)
            """, nativeQuery = true)
    FindAllRoomDTO getCustomerAndHouseForRent(@Param("customer") String customer, @Param("houseForRent") String houseForRent);

        @Query(value = """
                SELECT 
                 
                    COALESCE(SUM(s.price), 0) AS totalPriceService,
                    COALESCE(SUM(w.total_price), 0) AS totalPriceWater,
                    COALESCE(SUM(e.total_price), 0) AS totalPriceElectricity ,
                                r.id_customer as customer 
                FROM Room r
                LEFT JOIN service s ON r.id = s.id_room
                LEFT JOIN water w ON r.id = w.id_room AND w.status = 'CHUA_THANH_TOAN'
                LEFT JOIN electricity e ON r.id = e.id_room AND e.status = 'CHUA_THANH_TOAN'
                WHERE r.id = :id_room
                GROUP BY r.id
            """, nativeQuery = true)
        List<Object[]> getTotalPriceForRoom(@Param("id_room") String id_room);


    String id(String id);

    @Query(value = "SELECT " +
            "ROW_NUMBER() OVER (ORDER BY r.id) as stt, " +
            "r.id as id, " +
            "r.code as code, " +
            "r.name as name, " +
            "r.price as price, " +
            "r.acreage as acreage, " +
            "r.people_max as peopleMax, " +
            "r.decription as description, " +
            "r.type as type, " +
            "r.status as status, " +
            "c.name as customer, " +
            "h.name as houseForRent " +
            "FROM room r " +
            "LEFT JOIN customer c ON r.id_customer = c.id " +
            "LEFT JOIN house_for_rent h ON r.id_house_for_rent = h.id " +
            "WHERE r.id NOT IN (" +
            "SELECT b.id_room FROM bill b WHERE b.mother_pay = :month AND b.year_pay = :year)", nativeQuery = true)
    List<FindAllRoomProjection> findRoomsWithoutBillInMonthAndYear(@Param("month") int month,
                                                                   @Param("year") int year);

    @Query(value = """
    SELECT 
        r.id AS room_id,
        r.name AS room_name,
        r.price AS room_price,

        e.data_close AS total_electric_usage,
        e.unit_price AS electric_unit_price,
        e.total_price AS total_electric_price,

        w.data_close AS total_water_usage,
        w.unit_price AS water_unit_price,
        w.total_price AS total_water_price,

        COALESCE(SUM(sv.price), 0) AS total_service_price

    FROM room r

    LEFT JOIN electricity e ON e.id_room = r.id
    LEFT JOIN water w ON w.id_room = r.id
    LEFT JOIN room_services su ON su.id_room = r.id
    LEFT JOIN service sv ON sv.id = su.id_service

    WHERE r.id = :roomId

    GROUP BY 
        r.id, r.name, r.price,
        e.data_close, e.unit_price, e.total_price,
        w.data_close, w.unit_price, w.total_price
    """, nativeQuery = true)
    RoomDetailProjection findTotalPriceRoomDetailById(@Param("roomId") String roomId);


}
