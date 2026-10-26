package com.finance.dashboard.finance.cogs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CogsRepository extends JpaRepository<CogsRecord, Long> {
    List<CogsRecord> findByPeriodId(Long periodId);
    List<CogsRecord> findByRecordDateBetween(LocalDate startDate, LocalDate endDate);
    List<CogsRecord> findByProductLineContainingIgnoreCase(String productLine);

    @Query("SELECT COALESCE(SUM(c.totalCogs), 0) FROM CogsRecord c WHERE (:periodId IS NULL OR c.period.id = :periodId)")
    BigDecimal sumTotalCogsByPeriodId(@Param("periodId") Long periodId);

    @Query("SELECT c.productLine, SUM(c.totalCogs) FROM CogsRecord c GROUP BY c.productLine")
    List<Object[]> sumByProductLine();
}
