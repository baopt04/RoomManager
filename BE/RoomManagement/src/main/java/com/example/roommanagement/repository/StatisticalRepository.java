package com.example.roommanagement.repository;

import com.example.roommanagement.dto.request.statistical.*;
import com.example.roommanagement.entity.RoomHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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


    @Query(value = """
    SELECT 
        r.id AS roomId,
        r.name AS roomName,
        r.price AS roomPrice,
        
        COALESCE(SUM(w.total_price), 0) AS totalWater,
        COALESCE(SUM(e.total_price), 0) AS totalElectricity,
        COALESCE(SUM(s.price), 0) AS totalService,
        
        (r.price 
         + COALESCE(SUM(w.total_price), 0) 
         + COALESCE(SUM(e.total_price), 0) 
         + COALESCE(SUM(s.price), 0)) AS totalAll

    FROM room r
    LEFT JOIN water w ON w.id_room = r.id
    LEFT JOIN electricity e ON e.id_room = r.id
    LEFT JOIN room_services rs ON rs.id_room = r.id
    LEFT JOIN service s ON rs.id_service = s.id

    WHERE r.status = 'DANG_CHO_THUE'

    GROUP BY r.id, r.name, r.price
    """, nativeQuery = true)
    List<RoomRevenueProjection> getRoomRevenueDetails();

    @Query(value = """
        SELECT 
            COALESCE(SUM(r.price), 0) AS totalRoomPrice,
            COALESCE(SUM(w.total_price), 0) AS totalWater,
            COALESCE(SUM(e.total_price), 0) AS totalElectricity,
            COALESCE(SUM(s.price), 0) AS totalService,
            (COALESCE(SUM(r.price), 0) 
            + COALESCE(SUM(w.total_price), 0) 
            + COALESCE(SUM(e.total_price), 0) 
            + COALESCE(SUM(s.price), 0)) AS totalAll
        FROM room r
        LEFT JOIN water w ON w.id_room = r.id
        LEFT JOIN electricity e ON e.id_room = r.id
        LEFT JOIN room_services rs ON rs.id_room = r.id
        LEFT JOIN service s ON rs.id_service = s.id
        WHERE r.status = 'DANG_CHO_THUE'
        """, nativeQuery = true)
    TotalRevenueProjection getTotalRevenue();

    @Query(value = """
    SELECT
        COALESCE(e.mother, w.mother, MONTH(r.last_modified_date)) AS month,
        COALESCE(e.year, w.year, YEAR(r.last_modified_date)) AS year,

        COALESCE(SUM(DISTINCT r.price), 0) AS total_room,
        COALESCE(SUM(DISTINCT e.total_price), 0) AS total_electricity,
        COALESCE(SUM(DISTINCT w.total_price), 0) AS total_water,
        COALESCE(SUM(DISTINCT s.price), 0) AS total_service,

        COALESCE(SUM(DISTINCT r.price), 0) +
        COALESCE(SUM(DISTINCT e.total_price), 0) +
        COALESCE(SUM(DISTINCT w.total_price), 0) +
        COALESCE(SUM(DISTINCT s.price), 0) AS total_all

    FROM room r

    LEFT JOIN electricity e 
        ON r.id = e.id_room AND e.status = 'CHUA_THANH_TOAN'

    LEFT JOIN water w 
        ON r.id = w.id_room AND w.status = 'CHUA_THANH_TOAN'

    LEFT JOIN room_services rs 
        ON r.id = rs.id_room 
        AND MONTH(rs.last_modified_date) = COALESCE(e.mother, w.mother) 
        AND YEAR(rs.last_modified_date) = COALESCE(e.year, w.year)

    LEFT JOIN service s 
        ON rs.id_service = s.id

    WHERE r.status = 'DANG_CHO_THUE'

    GROUP BY
        COALESCE(e.mother, w.mother, MONTH(r.last_modified_date)),
        COALESCE(e.year, w.year, YEAR(r.last_modified_date))

    ORDER BY year, month
    """, nativeQuery = true)
    List<RoomMonthlyDebtProjection> getMonthlyRevenueSummary();


//  Truy vấn theo tháng tổng tiền
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


}
