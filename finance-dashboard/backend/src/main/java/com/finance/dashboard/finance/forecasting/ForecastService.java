package com.finance.dashboard.finance.forecasting;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class ForecastService {

    private final FinancialForecastRepository repository;

    public ForecastService(FinancialForecastRepository repository) {
        this.repository = repository;
    }

    public List<FinancialForecast> getAll(String modelName) {
        if (modelName != null && !modelName.trim().isEmpty()) {
            return repository.findByModelName(modelName.trim());
        }
        return repository.findAllByOrderByForecastMonthAsc();
    }

    public FinancialForecast getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Forecast model record not found with id: " + id));
    }

    @Transactional
    public FinancialForecast create(FinancialForecast forecast) {
        if (forecast.getActualRevenue() == null) forecast.setActualRevenue(BigDecimal.ZERO);
        if (forecast.getActualOpex() == null) forecast.setActualOpex(BigDecimal.ZERO);
        if (forecast.getRevenueGrowthRate() == null) forecast.setRevenueGrowthRate(new BigDecimal("10.00"));
        return repository.save(forecast);
    }

    @Transactional
    public FinancialForecast update(Long id, FinancialForecast updated) {
        FinancialForecast existing = getById(id);
        existing.setModelName(updated.getModelName());
        existing.setForecastMonth(updated.getForecastMonth());
        existing.setProjectedRevenue(updated.getProjectedRevenue());
        existing.setProjectedOpex(updated.getProjectedOpex());
        existing.setProjectedCogs(updated.getProjectedCogs());
        existing.setProjectedCashFlow(updated.getProjectedCashFlow());
        existing.setActualRevenue(updated.getActualRevenue() != null ? updated.getActualRevenue() : BigDecimal.ZERO);
        existing.setActualOpex(updated.getActualOpex() != null ? updated.getActualOpex() : BigDecimal.ZERO);
        existing.setRevenueGrowthRate(updated.getRevenueGrowthRate() != null ? updated.getRevenueGrowthRate() : new BigDecimal("10.00"));
        existing.setAssumptions(updated.getAssumptions());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        FinancialForecast forecast = getById(id);
        repository.delete(forecast);
    }

    public Map<String, Object> getAnalytics() {
        List<FinancialForecast> list = repository.findAllByOrderByForecastMonthAsc();

        List<Map<String, Object>> comparison = new ArrayList<>();
        BigDecimal totalProjectedRev = BigDecimal.ZERO;
        BigDecimal totalActualRev = BigDecimal.ZERO;

        for (FinancialForecast f : list) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", f.getForecastMonth());
            m.put("projectedRevenue", f.getProjectedRevenue());
            m.put("actualRevenue", f.getActualRevenue());
            m.put("projectedOpex", f.getProjectedOpex());
            m.put("actualOpex", f.getActualOpex());
            m.put("projectedCashFlow", f.getProjectedCashFlow());

            BigDecimal revVariance = f.getActualRevenue().subtract(f.getProjectedRevenue()).setScale(2, RoundingMode.HALF_UP);
            m.put("revenueVariance", revVariance);
            comparison.add(m);

            totalProjectedRev = totalProjectedRev.add(f.getProjectedRevenue());
            totalActualRev = totalActualRev.add(f.getActualRevenue());
        }

        Map<String, Object> res = new HashMap<>();
        res.put("monthlyProjections", comparison);
        res.put("cumulativeProjectedRevenue", totalProjectedRev);
        res.put("cumulativeActualRevenue", totalActualRev);
        return res;
    }
}
