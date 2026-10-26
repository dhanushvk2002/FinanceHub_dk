package com.finance.dashboard.finance.revenue;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RevenueRepository extends JpaRepository<RevenueRecord, Long> {
    List<RevenueRecord> findByPeriodId(Long periodId);
    List<RevenueRecord> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    List<RevenueRecord> findByCustomerNameContainingIgnoreCase(String customerName);

    @Query("SELECT COALESCE(SUM(r.netAmount), 0) FROM RevenueRecord r WHERE (:periodId IS NULL OR r.period.id = :periodId)")
    BigDecimal sumNetAmountByPeriodId(@Param("periodId") Long periodId);

    @Query("SELECT r.productCategory, SUM(r.netAmount) FROM RevenueRecord r GROUP BY r.productCategory")
    List<Object[]> sumByProductCategory();

    @Query("SELECT r.channel, SUM(r.netAmount) FROM RevenueRecord r GROUP BY r.channel")
    List<Object[]> sumByChannel();
}
