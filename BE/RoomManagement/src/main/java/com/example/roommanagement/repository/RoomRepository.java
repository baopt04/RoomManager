package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.room.FindAllRoomDTO;
import com.example.roommanagement.dto.request.room.ListPriceRoom;
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
            r.status as status ,
            r.id_customer as customer ,
            r.id_house_for_rent as houseForRent
            FROM Room r
            """, nativeQuery = true)
    List<FindAllRoomDTO> findRoom();

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
}
