package com.finance.dashboard.finance.expenses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OperatingExpenseRepository extends JpaRepository<OperatingExpense, Long> {
    List<OperatingExpense> findByPeriodId(Long periodId);
    List<OperatingExpense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);
    List<OperatingExpense> findByExpenseCategory(String expenseCategory);
    List<OperatingExpense> findByVendorNameContainingIgnoreCase(String vendorName);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM OperatingExpense e WHERE (:periodId IS NULL OR e.period.id = :periodId)")
    BigDecimal sumAmountByPeriodId(@Param("periodId") Long periodId);

    @Query("SELECT e.expenseCategory, SUM(e.amount) FROM OperatingExpense e GROUP BY e.expenseCategory")
    List<Object[]> sumByCategory();

    @Query("SELECT e.department, SUM(e.amount) FROM OperatingExpense e GROUP BY e.department")
    List<Object[]> sumByDepartment();
}
