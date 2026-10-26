package com.finance.dashboard.dashboard;

import com.finance.dashboard.finance.payables.AccountsPayable;
import com.finance.dashboard.finance.payments.PaymentsSettlement;
import com.finance.dashboard.finance.receivables.AccountsReceivable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    // Core KPIs
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal grossProfit;
    private BigDecimal grossMarginPercentage;
    private BigDecimal operatingEbitda;
    private BigDecimal ebitdaMarginPercentage;
    private BigDecimal cashBalance;
    private BigDecimal accountsReceivable;
    private BigDecimal accountsPayable;

    // Trend and comparison charts data
    private List<Map<String, Object>> revenueExpenseTrends;
    private List<Map<String, Object>> cashFlowTrend;
    private List<Map<String, Object>> revenueBreakdown;

    // Activity and Alerts
    private List<AccountsReceivable> recentInvoices;
    private List<PaymentsSettlement> recentPayments;
    private List<AccountsReceivable> overdueReceivables;
    private List<AccountsPayable> upcomingPayables;

    public DashboardSummaryDTO() {}

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getGrossMarginPercentage() { return grossMarginPercentage; }
    public void setGrossMarginPercentage(BigDecimal grossMarginPercentage) { this.grossMarginPercentage = grossMarginPercentage; }

    public BigDecimal getOperatingEbitda() { return operatingEbitda; }
    public void setOperatingEbitda(BigDecimal operatingEbitda) { this.operatingEbitda = operatingEbitda; }

    public BigDecimal getEbitdaMarginPercentage() { return ebitdaMarginPercentage; }
    public void setEbitdaMarginPercentage(BigDecimal ebitdaMarginPercentage) { this.ebitdaMarginPercentage = ebitdaMarginPercentage; }

    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }

    public BigDecimal getAccountsReceivable() { return accountsReceivable; }
    public void setAccountsReceivable(BigDecimal accountsReceivable) { this.accountsReceivable = accountsReceivable; }

    public BigDecimal getAccountsPayable() { return accountsPayable; }
    public void setAccountsPayable(BigDecimal accountsPayable) { this.accountsPayable = accountsPayable; }

    public List<Map<String, Object>> getRevenueExpenseTrends() { return revenueExpenseTrends; }
    public void setRevenueExpenseTrends(List<Map<String, Object>> revenueExpenseTrends) { this.revenueExpenseTrends = revenueExpenseTrends; }

    public List<Map<String, Object>> getCashFlowTrend() { return cashFlowTrend; }
    public void setCashFlowTrend(List<Map<String, Object>> cashFlowTrend) { this.cashFlowTrend = cashFlowTrend; }

    public List<Map<String, Object>> getRevenueBreakdown() { return revenueBreakdown; }
    public void setRevenueBreakdown(List<Map<String, Object>> revenueBreakdown) { this.revenueBreakdown = revenueBreakdown; }

    public List<AccountsReceivable> getRecentInvoices() { return recentInvoices; }
    public void setRecentInvoices(List<AccountsReceivable> recentInvoices) { this.recentInvoices = recentInvoices; }

    public List<PaymentsSettlement> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<PaymentsSettlement> recentPayments) { this.recentPayments = recentPayments; }

    public List<AccountsReceivable> getOverdueReceivables() { return overdueReceivables; }
    public void setOverdueReceivables(List<AccountsReceivable> overdueReceivables) { this.overdueReceivables = overdueReceivables; }

    public List<AccountsPayable> getUpcomingPayables() { return upcomingPayables; }
    public void setUpcomingPayables(List<AccountsPayable> upcomingPayables) { this.upcomingPayables = upcomingPayables; }
}
