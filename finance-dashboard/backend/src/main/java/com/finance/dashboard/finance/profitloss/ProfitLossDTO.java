package com.finance.dashboard.finance.profitloss;

import java.math.BigDecimal;

public class ProfitLossDTO {
    private String periodName;
    private String previousPeriodName;

    // Current period values
    private BigDecimal totalRevenue;
    private BigDecimal costOfGoodsSold;
    private BigDecimal grossProfit;
    private BigDecimal grossMarginPercentage;

    private BigDecimal operatingExpenses;
    private BigDecimal operatingProfit; // EBIT
    private BigDecimal operatingMarginPercentage;

    private BigDecimal otherIncome;
    private BigDecimal interestExpense;
    private BigDecimal taxes;
    private BigDecimal netProfit;
    private BigDecimal netProfitMarginPercentage;

    // Comparison against previous period
    private BigDecimal prevRevenue;
    private BigDecimal prevCogs;
    private BigDecimal prevGrossProfit;
    private BigDecimal prevOpex;
    private BigDecimal prevNetProfit;

    private BigDecimal revenueGrowthPercentage;
    private BigDecimal netProfitGrowthPercentage;

    public ProfitLossDTO() {}

    public String getPeriodName() { return periodName; }
    public void setPeriodName(String periodName) { this.periodName = periodName; }

    public String getPreviousPeriodName() { return previousPeriodName; }
    public void setPreviousPeriodName(String previousPeriodName) { this.previousPeriodName = previousPeriodName; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getCostOfGoodsSold() { return costOfGoodsSold; }
    public void setCostOfGoodsSold(BigDecimal costOfGoodsSold) { this.costOfGoodsSold = costOfGoodsSold; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getGrossMarginPercentage() { return grossMarginPercentage; }
    public void setGrossMarginPercentage(BigDecimal grossMarginPercentage) { this.grossMarginPercentage = grossMarginPercentage; }

    public BigDecimal getOperatingExpenses() { return operatingExpenses; }
    public void setOperatingExpenses(BigDecimal operatingExpenses) { this.operatingExpenses = operatingExpenses; }

    public BigDecimal getOperatingProfit() { return operatingProfit; }
    public void setOperatingProfit(BigDecimal operatingProfit) { this.operatingProfit = operatingProfit; }

    public BigDecimal getOperatingMarginPercentage() { return operatingMarginPercentage; }
    public void setOperatingMarginPercentage(BigDecimal operatingMarginPercentage) { this.operatingMarginPercentage = operatingMarginPercentage; }

    public BigDecimal getOtherIncome() { return otherIncome; }
    public void setOtherIncome(BigDecimal otherIncome) { this.otherIncome = otherIncome; }

    public BigDecimal getInterestExpense() { return interestExpense; }
    public void setInterestExpense(BigDecimal interestExpense) { this.interestExpense = interestExpense; }

    public BigDecimal getTaxes() { return taxes; }
    public void setTaxes(BigDecimal taxes) { this.taxes = taxes; }

    public BigDecimal getNetProfit() { return netProfit; }
    public void setNetProfit(BigDecimal netProfit) { this.netProfit = netProfit; }

    public BigDecimal getNetProfitMarginPercentage() { return netProfitMarginPercentage; }
    public void setNetProfitMarginPercentage(BigDecimal netProfitMarginPercentage) { this.netProfitMarginPercentage = netProfitMarginPercentage; }

    public BigDecimal getPrevRevenue() { return prevRevenue; }
    public void setPrevRevenue(BigDecimal prevRevenue) { this.prevRevenue = prevRevenue; }

    public BigDecimal getPrevCogs() { return prevCogs; }
    public void setPrevCogs(BigDecimal prevCogs) { this.prevCogs = prevCogs; }

    public BigDecimal getPrevGrossProfit() { return prevGrossProfit; }
    public void setPrevGrossProfit(BigDecimal prevGrossProfit) { this.prevGrossProfit = prevGrossProfit; }

    public BigDecimal getPrevOpex() { return prevOpex; }
    public void setPrevOpex(BigDecimal prevOpex) { this.prevOpex = prevOpex; }

    public BigDecimal getPrevNetProfit() { return prevNetProfit; }
    public void setPrevNetProfit(BigDecimal prevNetProfit) { this.prevNetProfit = prevNetProfit; }

    public BigDecimal getRevenueGrowthPercentage() { return revenueGrowthPercentage; }
    public void setRevenueGrowthPercentage(BigDecimal revenueGrowthPercentage) { this.revenueGrowthPercentage = revenueGrowthPercentage; }

    public BigDecimal getNetProfitGrowthPercentage() { return netProfitGrowthPercentage; }
    public void setNetProfitGrowthPercentage(BigDecimal netProfitGrowthPercentage) { this.netProfitGrowthPercentage = netProfitGrowthPercentage; }
}
