package com.finance.dashboard.finance.grossprofit;

import com.finance.dashboard.finance.cogs.CogsRepository;
import com.finance.dashboard.finance.revenue.RevenueRecord;
import com.finance.dashboard.finance.revenue.RevenueRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class GrossProfitService {

    private final RevenueRepository revenueRepository;
    private final CogsRepository cogsRepository;

    public GrossProfitService(RevenueRepository revenueRepository, CogsRepository cogsRepository) {
        this.revenueRepository = revenueRepository;
        this.cogsRepository = cogsRepository;
    }

    public GrossProfitDTO calculateGrossProfitAndUnitEconomics(Long periodId) {
        BigDecimal totalRevenue = revenueRepository.sumNetAmountByPeriodId(periodId);
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal totalCogs = cogsRepository.sumTotalCogsByPeriodId(periodId);
        if (totalCogs == null) totalCogs = BigDecimal.ZERO;

        BigDecimal grossProfit = totalRevenue.subtract(totalCogs).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grossMargin = (totalRevenue.compareTo(BigDecimal.ZERO) > 0)
                ? grossProfit.multiply(BigDecimal.valueOf(100)).divide(totalRevenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<RevenueRecord> revList = (periodId != null) 
                ? revenueRepository.findByPeriodId(periodId) 
                : revenueRepository.findAll();

        int totalUnits = 0;
        for (RevenueRecord r : revList) {
            totalUnits += (r.getUnitsSold() != null ? r.getUnitsSold() : 1);
        }
        if (totalUnits == 0) totalUnits = 1;

        BigDecimal arpu = totalRevenue.divide(BigDecimal.valueOf(totalUnits), 2, RoundingMode.HALF_UP);
        BigDecimal avgCostPerUnit = totalCogs.divide(BigDecimal.valueOf(totalUnits), 2, RoundingMode.HALF_UP);
        BigDecimal cmPerUnit = arpu.subtract(avgCostPerUnit).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cmRatio = (arpu.compareTo(BigDecimal.ZERO) > 0)
                ? cmPerUnit.multiply(BigDecimal.valueOf(100)).divide(arpu, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Breakdown by product category
        List<Map<String, Object>> productEconomics = new ArrayList<>();
        Map<String, BigDecimal> catRevenue = new HashMap<>();
        Map<String, Integer> catUnits = new HashMap<>();

        for (RevenueRecord r : revList) {
            String cat = r.getProductCategory();
            catRevenue.put(cat, catRevenue.getOrDefault(cat, BigDecimal.ZERO).add(r.getNetAmount()));
            catUnits.put(cat, catUnits.getOrDefault(cat, 0) + (r.getUnitsSold() != null ? r.getUnitsSold() : 1));
        }
        for (String cat : catRevenue.keySet()) {
            BigDecimal rev = catRevenue.get(cat);
            int units = catUnits.get(cat);
            // approximate cogs allocation
            BigDecimal allocCogs = totalCogs.compareTo(BigDecimal.ZERO) > 0 && totalRevenue.compareTo(BigDecimal.ZERO) > 0
                    ? totalCogs.multiply(rev).divide(totalRevenue, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            BigDecimal gp = rev.subtract(allocCogs);
            BigDecimal margin = (rev.compareTo(BigDecimal.ZERO) > 0)
                    ? gp.multiply(BigDecimal.valueOf(100)).divide(rev, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            Map<String, Object> item = new HashMap<>();
            item.put("productCategory", cat);
            item.put("revenue", rev);
            item.put("cogs", allocCogs);
            item.put("grossProfit", gp);
            item.put("grossMarginPercentage", margin);
            item.put("unitsSold", units);
            item.put("unitPrice", rev.divide(BigDecimal.valueOf(units), 2, RoundingMode.HALF_UP));
            productEconomics.add(item);
        }

        GrossProfitDTO dto = new GrossProfitDTO();
        dto.setTotalRevenue(totalRevenue);
        dto.setTotalCogs(totalCogs);
        dto.setGrossProfit(grossProfit);
        dto.setGrossMarginPercentage(grossMargin);
        dto.setTotalUnitsSold(totalUnits);
        dto.setAverageRevenuePerUnit(arpu);
        dto.setAverageCostPerUnit(avgCostPerUnit);
        dto.setContributionMarginPerUnit(cmPerUnit);
        dto.setContributionMarginRatio(cmRatio);
        dto.setProductEconomics(productEconomics);
        return dto;
    }
}
