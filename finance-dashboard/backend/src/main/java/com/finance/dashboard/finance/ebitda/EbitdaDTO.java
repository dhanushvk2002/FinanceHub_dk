package com.finance.dashboard.finance.ebitda;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class EbitdaDTO {
    private String periodName;
    private BigDecimal revenue;
    private BigDecimal cogs;
    private BigDecimal grossProfit;

    private BigDecimal operatingExpenses;
    private BigDecimal depreciationAndAmortization;
    private BigDecimal cashOpex;

    private BigDecimal operatingEbitda;
    private BigDecimal ebitdaMarginPercentage;

    // Prior period comparison
    private BigDecimal priorPeriodEbitda;
    private BigDecimal ebitdaVariance;
    private BigDecimal ebitdaGrowthPercentage;

    // EBITDA Bridge Breakdown (Waterfall items)
    private List<Map<String, Object>> bridgeItems;

    public EbitdaDTO() {}

    public String getPeriodName() { return periodName; }
    public void setPeriodName(String periodName) { this.periodName = periodName; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public BigDecimal getCogs() { return cogs; }
    public void setCogs(BigDecimal cogs) { this.cogs = cogs; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getOperatingExpenses() { return operatingExpenses; }
    public void setOperatingExpenses(BigDecimal operatingExpenses) { this.operatingExpenses = operatingExpenses; }

    public BigDecimal getDepreciationAndAmortization() { return depreciationAndAmortization; }
    public void setDepreciationAndAmortization(BigDecimal depreciationAndAmortization) { this.depreciationAndAmortization = depreciationAndAmortization; }

    public BigDecimal getCashOpex() { return cashOpex; }
    public void setCashOpex(BigDecimal cashOpex) { this.cashOpex = cashOpex; }

    public BigDecimal getOperatingEbitda() { return operatingEbitda; }
    public void setOperatingEbitda(BigDecimal operatingEbitda) { this.operatingEbitda = operatingEbitda; }

    public BigDecimal getEbitdaMarginPercentage() { return ebitdaMarginPercentage; }
    public void setEbitdaMarginPercentage(BigDecimal ebitdaMarginPercentage) { this.ebitdaMarginPercentage = ebitdaMarginPercentage; }

    public BigDecimal getPriorPeriodEbitda() { return priorPeriodEbitda; }
    public void setPriorPeriodEbitda(BigDecimal priorPeriodEbitda) { this.priorPeriodEbitda = priorPeriodEbitda; }

    public BigDecimal getEbitdaVariance() { return ebitdaVariance; }
    public void setEbitdaVariance(BigDecimal ebitdaVariance) { this.ebitdaVariance = ebitdaVariance; }

    public BigDecimal getEbitdaGrowthPercentage() { return ebitdaGrowthPercentage; }
    public void setEbitdaGrowthPercentage(BigDecimal ebitdaGrowthPercentage) { this.ebitdaGrowthPercentage = ebitdaGrowthPercentage; }

    public List<Map<String, Object>> getBridgeItems() { return bridgeItems; }
    public void setBridgeItems(List<Map<String, Object>> bridgeItems) { this.bridgeItems = bridgeItems; }
}
