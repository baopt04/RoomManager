package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusCustomer;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findById(String id);
    boolean existsByCustomer_IdAndStatus(String idCustomer, StatusRoom status);

    Boolean existsByName(String name);

    @Query(value = """
            select 
            row_number() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id, 
            r.code as code ,
            r.name as name , 
            r.slug as slug ,
            r.price as price , 
            r.acreage as acreage ,
            r.people_Max as peopleMax ,
            r.decription as description ,
            r.type as type , 
            r.status as status ,
            c.name as customer ,
            h.name as houseForRent
            from room r 
            left join customer c on c.id = r.id_customer 
            left join house_for_rent h on h.id = r.id_house_for_rent
            where c.id = :idCustomer
            """, nativeQuery = true)
    List<FindAllRoomDTO> findByCustomer_Id(@Param("idCustomer") String idCustomer);
    @Query(value = """
            select 
            row_number() over(order by r.last_modified_date desc ) as stt ,
                        r.id as id, 
            r.code as code ,
            r.name as name , 
            r.slug as slug ,
            r.price as price , 
            r.acreage as acreage ,
            r.people_Max as peopleMax ,
            r.decription as description ,
            r.type as type , 
            r.status as status ,
            c.name as customer ,
            h.name as houseForRent
            from room r
            left join customer c on c.id = r.id_customer
            left join house_for_rent h on h.id = r.id_house_for_rent
            """, countQuery = """
            select count(r.id)
            from room r
            left join customer c on c.id = r.id_customer
            left join house_for_rent h on h.id = r.id_house_for_rent
            """, nativeQuery = true)
    Page<FindAllRoomDTO> findRoom(Pageable pageable);

    @Query(value = """
            select 
                row_number() over (order by r.last_modified_date desc) as stt,
                r.id as id,
                r.code as code,
                r.name as name,
                r.slug as slug,
                r.price as price,
                r.acreage as acreage,
                r.people_Max as peopleMax,
                r.decription as description,
                r.type as type,
                r.status as status,
                c.name as customer,
                h.name as houseForRent
            from room r
            left join customer c on c.id = r.id_customer
            left join house_for_rent h on h.id = r.id_house_for_rent
            where 
                (:houseForRentId is null or r.id_house_for_rent = :houseForRentId)
                and (:customerId is null or r.id_customer = :customerId)
            """, nativeQuery = true)
    List<FindAllRoomDTO> findAllRoomsByHouseForRentAndCustomer(
            @Param("houseForRentId") String houseForRentId,
            @Param("customerId") String customerId
    );


    @Query(value = """
            select 
             row_number() over(order by r.last_modified_date desc ) as stt ,
             r.id as id ,
                  r.code as code ,
                        r.name as name , 
                        r.slug as slug ,
                        r.price as price , 
                        r.acreage as acreage ,
                        r.people_Max as peopleMax ,
                        r.decription as description ,
                         r.type as type , 
                        r.status as status ,
                        c.name as customer ,
                        h.name as houseForRent
             from room r 
             left join customer c on c.id = r.id_customer
             left join house_for_rent h on h.id = r.id_house_for_rent
             where 
             (:customer is null or c.name like %:customer%)
             and (:houseForRent is null or h.name like %:houseForRent%)
            """, nativeQuery = true)
    FindAllRoomDTO getCustomerAndHouseForRent(@Param("customer") String customer, @Param("houseForRent") String houseForRent);

    @Query(value = """
                select 
            
                    coalesce(sum(s.price), 0) as totalPriceService,
                    coalesce(sum(w.total_price), 0) as totalPriceWater,
                    coalesce(sum(e.total_price), 0) as totalPriceElectricity ,
                                r.id_customer as customer 
                from room r
                left join service s on r.id = s.id_room
                left join water w on r.id = w.id_room and w.status = 'CHUA_THANH_TOAN'
                left join electricity e on r.id = e.id_room and e.status = 'CHUA_THANH_TOAN'
                where r.id = :id_room
                group by r.id
            """, nativeQuery = true)
    List<Object[]> getTotalPriceForRoom(@Param("id_room") String id_room);


    String id(String id);

    @Query(value = "SELECT " +
            "ROW_NUMBER() OVER (ORDER BY r.id) as stt, " +
            "r.id as id, " +
            "r.code as code, " +
            "r.name as name, " +
            "r.slug as slug, " +
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
            "WHERE r.status = 'DANG_CHO_THUE' AND r.id NOT IN (" +
            "SELECT b.id_room FROM bill b WHERE b.mother_pay = :month AND b.year_pay = :year)",
            nativeQuery = true)
    List<FindAllRoomProjection> findRoomsWithoutBillInMonthAndYear(@Param("month") int month,
                                                                   @Param("year") int year);


    @Query(value = """
            select 
                r.id as room_id,
                r.name as room_name,
                r.slug as room_slug,
                r.price as room_price,
            
                e.data_close as total_electric_usage,
                e.unit_price as electric_unit_price,
                e.total_price as total_electric_price,
            
                w.data_close as total_water_usage,
                w.unit_price as water_unit_price,
                w.total_price as total_water_price,
            
                coalesce(sum(sv.price), 0) as total_service_price
            
            from room r
            
            left join electricity e on e.id_room = r.id
            left join water w on w.id_room = r.id
            left join room_services su on su.id_room = r.id
            left join service sv on sv.id = su.id_service
            
            where r.id = :roomId
            
            group by 
                r.id, r.name, r.slug, r.price,
                e.data_close, e.unit_price, e.total_price,
                w.data_close, w.unit_price, w.total_price
            """, nativeQuery = true)
    RoomDetailProjection findTotalPriceRoomDetailById(@Param("roomId") String roomId);

    @Query(value = """
                select 
                    count(CASE WHEN r.status = 'TRONG' THEN 1 END) as roomEmpty,
                    count(CASE WHEN r.status = 'DANG_CHO_THUE' THEN 1 END) as roomRenting
                from room r
            """, nativeQuery = true)
    List<RoomStatusCountProjection> getAllStatusRoom();
    @Query("SELECT c.status FROM Contract c WHERE c.room.id = :roomId")
    StatusContract getContractStatus(@Param("roomId") String roomId);

    @Query("""
            SELECT DISTINCT r FROM Room r
            LEFT JOIN FETCH r.customer
            WHERE r.houseForRent.id = :houseForRentId
            ORDER BY r.name ASC
            """)
    List<Room> findRoomsForHouseOrderByName(@Param("houseForRentId") String houseForRentId);

}
