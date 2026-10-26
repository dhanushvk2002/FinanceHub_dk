package com.finance.dashboard.finance.period;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialPeriodRepository extends JpaRepository<FinancialPeriod, Long> {
    Optional<FinancialPeriod> findByPeriodName(String periodName);
    Optional<FinancialPeriod> findFirstByIsClosedFalseOrderByStartDateAsc();
}
