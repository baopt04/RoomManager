package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.statistical.*;
import com.example.roommanagement.entity.RoomHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StatisticalRepository extends JpaRepository<RoomHistory , String> {

    @Query(value = """
    select
      (select ifnull(sum(price), 0) from room_history where is_paid = 1) as totalRoomPrice,

      (select ifnull(sum(total_price), 0) from water_history) as totalWaterPrice,

      (select ifnull(sum(total_price), 0) from electricity_history) as totalElectricityPrice,

      (
        select ifnull(sum(s.price), 0)
        from room_services rs
        join service s on rs.id_service = s.id
      ) as totalServicePrice,

      (select count(*) from room where status = 'TRONG') as totalAvailable,

      (select count(*) from room where status = 'DANG_CHO_THUE') as totalRented,

      (
        (select ifnull(sum(price), 0) from room_history where is_paid = 1)
        +
        (select ifnull(sum(total_price), 0) from water_history)
        +
        (select ifnull(sum(total_price), 0) from electricity_history)
        +
        (
          select ifnull(sum(s.price), 0)
          from room_services rs
          join service s on rs.id_service = s.id
        )
      ) as totalSystemRevenue
    """, nativeQuery = true)
    FindAllStatisticalProjection getTotalSystemRevenue();

 // Query by current month now
 @Query(value = """
    select 
        month(curdate()) as monthNow,
        coalesce(sum(r.price), 0) as totalRoomPrice,
        coalesce(sum(w.totalWater), 0) as totalWater,
        coalesce(sum(e.totalElectricity), 0) as totalElectricity,
        coalesce(sum(s.totalService), 0) as totalService,
        (
            coalesce(sum(r.price), 0) 
            + coalesce(sum(w.totalWater), 0) 
            + coalesce(sum(e.totalElectricity), 0) 
            + coalesce(sum(s.totalService), 0)
        ) as totalAll
    from room r
    left join (
        select id_room, sum(total_price) as totalWater
        from water
        where mother = month(curdate()) and year = year(curdate())
        group by id_room
    ) w on w.id_room = r.id
    left join (
        select id_room, sum(total_price) as totalElectricity
        from electricity
        where mother = month(curdate()) and year = year(curdate())
        group by id_room
    ) e on e.id_room = r.id
    left join (
        select rs.id_room, sum(s.price) as totalService
        from room_services rs
        join service s on rs.id_service = s.id
        group by rs.id_room
    ) s on s.id_room = r.id
    where r.status = 'DANG_CHO_THUE'
    """, nativeQuery = true)
 TotalRevenueProjection getTotalRevenueForCurrentMonth();







//  Query by current list for month totals
    @Query(
            value = """
        with all_months as (
            select month, year from water_history where status = 'DA_THANH_TOAN'
            union
            select month, year from electricity_history where status = 'DA_THANH_TOAN'
            union
            select month(last_modified_date) as month, year(last_modified_date) as year 
            from room where status = 'DANG_CHO_THUE'
        ),
        service_total as (
            select ifnull(sum(s.price), 0) as tong_tien_dich_vu
            from room_services rs
            join service s on rs.id_service = s.id
        )
        select 
            am.month as month,
            am.year as year,
            ifnull(w.tong_tien_nuoc, 0) as totalWater,
            ifnull(e.tong_tien_dien, 0) as totalElectricity,
            ifnull(r.tong_tien_phong, 0) as totalRoom,
            st.tong_tien_dich_vu as totalService,
            (
                ifnull(w.tong_tien_nuoc, 0) +
                ifnull(e.tong_tien_dien, 0) +
                ifnull(r.tong_tien_phong, 0) +
                st.tong_tien_dich_vu
            ) as totalMonth
        from all_months am
        left join (
            select month, year, sum(total_price) as tong_tien_nuoc
            from water_history
            where status = 'DA_THANH_TOAN'
            group by month, year
        ) as w on am.month = w.month and am.year = w.year
        left join (
            select month, year, sum(total_price) as tong_tien_dien
            from electricity_history
            where status = 'DA_THANH_TOAN'
            group by month, year
        ) as e on am.month = e.month and am.year = e.year
        left join (
            select month(last_modified_date) as month, year(last_modified_date) as year, sum(price) as tong_tien_phong
            from room
            where status = 'DANG_CHO_THUE'
            group by year(last_modified_date), month(last_modified_date)
        ) as r on am.month = r.month and am.year = r.year
        join service_total st on 1=1
        order by am.year, am.month
    """,
            nativeQuery = true
    )
    List<MonthlyTotalDTO> findMonthlyTotals();

    @Query(value = """
    select 
        r.name as roomName,
        b.mother_pay as month,
        b.year_pay as year,
        b.total_room as roomPrice,
        b.total_electricity_service as electricityPrice,
        b.total_water_service as waterPrice,
        b.total_room_service as servicePrice,
        b.total_amount as totalAmount
    from bill b
    join room r on b.id_room = r.id
    where b.status = 'DA_THANH_TOAN'
    and b.mother_pay = month(curdate())
    and b.year_pay = year(curdate())
    """, nativeQuery = true)
    List<RevenueStatisticalProjection> findAllRevenueStatistical();

    @Query(value = """
    select 
        c.name as name,
        c.number_phone as numberPhone,
        c.citizen_identification as cccd,
        coalesce(r.name, 'Chưa thuê') as roomName,
        con.date_start as dateStart
    from customer c
    left join contract con on c.id = con.id_customer and con.status = 'KICH_HOAT'
    left join room r on con.id_room = r.id
    """, nativeQuery = true)
    List<CustomerStatisticalProjection> findAllCustomerStatistical();

    @Query(value = """
    select 
        r.code as code,
        r.name as name,
        r.price as price,
        r.status as status,
        h.name as houseName,
        r.acreage as acreage
    from room r
    left join house_for_rent h on r.id_house_for_rent = h.id
    """, nativeQuery = true)
    List<RoomStatisticalProjection> findAllRoomStatistical();

    @Query(value = """
    select 
        r.id as roomId,
        w.id as waterId,
        e.id as electricityId,
        rh.id as roomHistoryId,
        s.id as serviceId,
        s.name as serviceName,
        s.price as servicePrice
    from room r
    left join water w on r.id = w.id_room
    left join electricity e on r.id = e.id_room
    left join room_history rh on r.id = rh.id_room
    left join room_services rs on r.id = rs.id_room
    left join service s on rs.id_service = s.id
    where r.id = :roomId
""", nativeQuery = true)
List<SearchRoomProjection> findRoomDetailsByRoomId(@Param("roomId") String roomId);
}
