package com.finance.dashboard.finance.cashflow;

import java.math.BigDecimal;
import java.util.List;

public class CashFlowDTO {
    private BigDecimal operatingCashFlow;
    private BigDecimal investingCashFlow;
    private BigDecimal financingCashFlow;
    private BigDecimal netCashFlow;
    private BigDecimal openingCashBalance;
    private BigDecimal closingCashBalance;

    private List<CashFlowRecord> records;

    public CashFlowDTO() {}

    public BigDecimal getOperatingCashFlow() { return operatingCashFlow; }
    public void setOperatingCashFlow(BigDecimal operatingCashFlow) { this.operatingCashFlow = operatingCashFlow; }

    public BigDecimal getInvestingCashFlow() { return investingCashFlow; }
    public void setInvestingCashFlow(BigDecimal investingCashFlow) { this.investingCashFlow = investingCashFlow; }

    public BigDecimal getFinancingCashFlow() { return financingCashFlow; }
    public void setFinancingCashFlow(BigDecimal financingCashFlow) { this.financingCashFlow = financingCashFlow; }

    public BigDecimal getNetCashFlow() { return netCashFlow; }
    public void setNetCashFlow(BigDecimal netCashFlow) { this.netCashFlow = netCashFlow; }

    public BigDecimal getOpeningCashBalance() { return openingCashBalance; }
    public void setOpeningCashBalance(BigDecimal openingCashBalance) { this.openingCashBalance = openingCashBalance; }

    public BigDecimal getClosingCashBalance() { return closingCashBalance; }
    public void setClosingCashBalance(BigDecimal closingCashBalance) { this.closingCashBalance = closingCashBalance; }

    public List<CashFlowRecord> getRecords() { return records; }
    public void setRecords(List<CashFlowRecord> records) { this.records = records; }
}
