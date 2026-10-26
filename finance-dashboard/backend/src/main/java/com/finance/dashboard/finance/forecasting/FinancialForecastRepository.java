package com.finance.dashboard.finance.forecasting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialForecastRepository extends JpaRepository<FinancialForecast, Long> {
    List<FinancialForecast> findByModelName(String modelName);
    List<FinancialForecast> findAllByOrderByForecastMonthAsc();
}
