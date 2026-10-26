package com.finance.dashboard.finance.cashflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CashFlowRepository extends JpaRepository<CashFlowRecord, Long> {
    List<CashFlowRecord> findByPeriodId(Long periodId);
    List<CashFlowRecord> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT c.activityType, COALESCE(SUM(c.netMovement), 0) FROM CashFlowRecord c WHERE (:periodId IS NULL OR c.period.id = :periodId) GROUP BY c.activityType")
    List<Object[]> sumNetMovementByActivity(@Param("periodId") Long periodId);
}
