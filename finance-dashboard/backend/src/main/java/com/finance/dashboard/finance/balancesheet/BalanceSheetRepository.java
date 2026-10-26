package com.finance.dashboard.finance.balancesheet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BalanceSheetRepository extends JpaRepository<BalanceSheetItem, Long> {
    List<BalanceSheetItem> findByPeriodId(Long periodId);

    List<BalanceSheetItem> findByClassification(String classification);

    @Query("SELECT b.classification, COALESCE(SUM(b.amount), 0) FROM BalanceSheetItem b WHERE (:periodId IS NULL OR b.period.id = :periodId) GROUP BY b.classification")
    List<Object[]> sumByClassification(@Param("periodId") Long periodId);
}
