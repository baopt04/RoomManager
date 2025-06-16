package com.example.roommanagement.repository;

import com.example.roommanagement.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentHistoryRepository  extends JpaRepository<PaymentHistory , String> {
}
