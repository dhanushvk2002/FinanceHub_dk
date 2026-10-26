package com.finance.dashboard.finance.grossprofit;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class GrossProfitDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalCogs;
    private BigDecimal grossProfit;
    private BigDecimal grossMarginPercentage;

    // Unit Economics
    private Integer totalUnitsSold;
    private BigDecimal averageRevenuePerUnit; // ARPU
    private BigDecimal averageCostPerUnit;
    private BigDecimal contributionMarginPerUnit;
    private BigDecimal contributionMarginRatio;

    private List<Map<String, Object>> productEconomics;

    public GrossProfitDTO() {}

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalCogs() { return totalCogs; }
    public void setTotalCogs(BigDecimal totalCogs) { this.totalCogs = totalCogs; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getGrossMarginPercentage() { return grossMarginPercentage; }
    public void setGrossMarginPercentage(BigDecimal grossMarginPercentage) { this.grossMarginPercentage = grossMarginPercentage; }

    public Integer getTotalUnitsSold() { return totalUnitsSold; }
    public void setTotalUnitsSold(Integer totalUnitsSold) { this.totalUnitsSold = totalUnitsSold; }

    public BigDecimal getAverageRevenuePerUnit() { return averageRevenuePerUnit; }
    public void setAverageRevenuePerUnit(BigDecimal averageRevenuePerUnit) { this.averageRevenuePerUnit = averageRevenuePerUnit; }

    public BigDecimal getAverageCostPerUnit() { return averageCostPerUnit; }
    public void setAverageCostPerUnit(BigDecimal averageCostPerUnit) { this.averageCostPerUnit = averageCostPerUnit; }

    public BigDecimal getContributionMarginPerUnit() { return contributionMarginPerUnit; }
    public void setContributionMarginPerUnit(BigDecimal contributionMarginPerUnit) { this.contributionMarginPerUnit = contributionMarginPerUnit; }

    public BigDecimal getContributionMarginRatio() { return contributionMarginRatio; }
    public void setContributionMarginRatio(BigDecimal contributionMarginRatio) { this.contributionMarginRatio = contributionMarginRatio; }

    public List<Map<String, Object>> getProductEconomics() { return productEconomics; }
    public void setProductEconomics(List<Map<String, Object>> productEconomics) { this.productEconomics = productEconomics; }
}
