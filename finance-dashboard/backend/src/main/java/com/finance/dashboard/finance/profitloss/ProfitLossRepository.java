package com.finance.dashboard.finance.profitloss;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfitLossRepository extends JpaRepository<ProfitLossStatement, Long> {
    Optional<ProfitLossStatement> findFirstByPeriodIdOrderByStatementDateDesc(Long periodId);
    List<ProfitLossStatement> findAllByOrderByStatementDateDesc();
}
