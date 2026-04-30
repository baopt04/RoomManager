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
    SELECT
      (SELECT IFNULL(SUM(price), 0) FROM room_history WHERE is_paid = 1) AS totalRoomPrice,

      (SELECT IFNULL(SUM(total_price), 0) FROM water_history) AS totalWaterPrice,

      (SELECT IFNULL(SUM(total_price), 0) FROM electricity_history) AS totalElectricityPrice,

      (
        SELECT IFNULL(SUM(s.price), 0)
        FROM room_services rs
        JOIN service s ON rs.id_service = s.id
      ) AS totalServicePrice,

      (SELECT COUNT(*) FROM room WHERE status = 'TRONG') AS totalAvailable,

      (SELECT COUNT(*) FROM room WHERE status = 'DANG_CHO_THUE') AS totalRented,

      (
        (SELECT IFNULL(SUM(price), 0) FROM room_history WHERE is_paid = 1)
        +
        (SELECT IFNULL(SUM(total_price), 0) FROM water_history)
        +
        (SELECT IFNULL(SUM(total_price), 0) FROM electricity_history)
        +
        (
          SELECT IFNULL(SUM(s.price), 0)
          FROM room_services rs
          JOIN service s ON rs.id_service = s.id
        )
      ) AS totalSystemRevenue
    """, nativeQuery = true)
    FindAllStatisticalProjection getTotalSystemRevenue();

 // Query by current month now
 @Query(value = """
    SELECT 
        MONTH(CURDATE()) AS monthNow,
        COALESCE(SUM(r.price), 0) AS totalRoomPrice,
        COALESCE(SUM(w.totalWater), 0) AS totalWater,
        COALESCE(SUM(e.totalElectricity), 0) AS totalElectricity,
        COALESCE(SUM(s.totalService), 0) AS totalService,
        (
            COALESCE(SUM(r.price), 0) 
            + COALESCE(SUM(w.totalWater), 0) 
            + COALESCE(SUM(e.totalElectricity), 0) 
            + COALESCE(SUM(s.totalService), 0)
        ) AS totalAll
    FROM room r
    LEFT JOIN (
        SELECT id_room, SUM(total_price) AS totalWater
        FROM water
        WHERE mother = MONTH(CURDATE()) AND year = YEAR(CURDATE())
        GROUP BY id_room
    ) w ON w.id_room = r.id
    LEFT JOIN (
        SELECT id_room, SUM(total_price) AS totalElectricity
        FROM electricity
        WHERE mother = MONTH(CURDATE()) AND year = YEAR(CURDATE())
        GROUP BY id_room
    ) e ON e.id_room = r.id
    LEFT JOIN (
        SELECT rs.id_room, SUM(s.price) AS totalService
        FROM room_services rs
        JOIN service s ON rs.id_service = s.id
        GROUP BY rs.id_room
    ) s ON s.id_room = r.id
    WHERE r.status = 'DANG_CHO_THUE'
    """, nativeQuery = true)
 TotalRevenueProjection getTotalRevenueForCurrentMonth();







//  Query by current list for month totals
    @Query(
            value = """
        SELECT 
            am.month AS month,
            am.year AS year,
            IFNULL(w.tong_tien_nuoc, 0) AS totalWater,
            IFNULL(e.tong_tien_dien, 0) AS totalElectricity,
            IFNULL(r.tong_tien_phong, 0) AS totalRoom,
            IFNULL(s.tong_tien_dich_vu, 0) AS totalService,
            (
                IFNULL(w.tong_tien_nuoc, 0) +
                IFNULL(e.tong_tien_dien, 0) +
                IFNULL(r.tong_tien_phong, 0) +
                IFNULL(s.tong_tien_dich_vu, 0)
            ) AS totalMonth
        FROM (
            SELECT month, year FROM (
                SELECT month, year FROM water_history WHERE status = 'DA_THANH_TOAN'
                UNION
                SELECT month, year FROM electricity_history WHERE status = 'DA_THANH_TOAN'
                UNION
                SELECT MONTH(last_modified_date) AS month, YEAR(last_modified_date) AS year 
                FROM room WHERE status = 'DANG_CHO_THUE'
            ) AS all_months
        ) AS am
        LEFT JOIN (
            SELECT month, year, SUM(total_price) AS tong_tien_nuoc
            FROM water_history
            WHERE status = 'DA_THANH_TOAN'
            GROUP BY month, year
        ) AS w ON am.month = w.month AND am.year = w.year
        LEFT JOIN (
            SELECT month, year, SUM(total_price) AS tong_tien_dien
            FROM electricity_history
            WHERE status = 'DA_THANH_TOAN'
            GROUP BY month, year
        ) AS e ON am.month = e.month AND am.year = e.year
        LEFT JOIN (
            SELECT MONTH(last_modified_date) AS month, YEAR(last_modified_date) AS year, SUM(price) AS tong_tien_phong
            FROM room
            WHERE status = 'DANG_CHO_THUE'
            GROUP BY YEAR(last_modified_date), MONTH(last_modified_date)
        ) AS r ON am.month = r.month AND am.year = r.year
        CROSS JOIN (
            SELECT SUM(s.price) AS tong_tien_dich_vu
            FROM room_services rs
            JOIN service s ON rs.id_service = s.id
        ) AS s
        ORDER BY am.year, am.month
    """,
            nativeQuery = true
    )
    List<MonthlyTotalDTO> findMonthlyTotals();

    @Query(value = """
    SELECT 
        r.name AS roomName,
        b.mother_pay AS month,
        b.year_pay AS year,
        b.total_room AS roomPrice,
        b.total_electricity_service AS electricityPrice,
        b.total_water_service AS waterPrice,
        b.total_room_service AS servicePrice,
        b.total_amount AS totalAmount
    FROM bill b
    JOIN room r ON b.id_room = r.id
    WHERE b.status = 'DA_THANH_TOAN'
    AND b.mother_pay = MONTH(CURDATE())
    AND b.year_pay = YEAR(CURDATE())
    """, nativeQuery = true)
    List<RevenueStatisticalProjection> findAllRevenueStatistical();

    @Query(value = """
    SELECT 
        c.name AS name,
        c.number_phone AS numberPhone,
        c.citizen_identification AS cccd,
        COALESCE(r.name, 'Chưa thuê') AS roomName,
        con.date_start AS dateStart
    FROM customer c
    LEFT JOIN contract con ON c.id = con.id_customer AND con.status = 'KICH_HOAT'
    LEFT JOIN room r ON con.id_room = r.id
    """, nativeQuery = true)
    List<CustomerStatisticalProjection> findAllCustomerStatistical();

    @Query(value = """
    SELECT 
        r.code AS code,
        r.name AS name,
        r.price AS price,
        r.status AS status,
        h.name AS houseName,
        r.acreage AS acreage
    FROM room r
    LEFT JOIN house_for_rent h ON r.id_house_for_rent = h.id
    """, nativeQuery = true)
    List<RoomStatisticalProjection> findAllRoomStatistical();

    @Query(value = """
    SELECT 
        r.id AS roomId,
        w.id AS waterId,
        e.id AS electricityId,
        rh.id AS roomHistoryId,
        s.id AS serviceId,
        s.name AS serviceName,
        s.price AS servicePrice
    FROM room r
    LEFT JOIN water w ON r.id = w.id_room
    LEFT JOIN electricity e ON r.id = e.id_room
    LEFT JOIN room_history rh ON r.id = rh.id_room
    LEFT JOIN room_services rs ON r.id = rs.id_room
    LEFT JOIN service s ON rs.id_service = s.id
    WHERE r.id = :roomId
""", nativeQuery = true)
List<SearchRoomProjection> findRoomDetailsByRoomId(@Param("roomId") String roomId);
}
