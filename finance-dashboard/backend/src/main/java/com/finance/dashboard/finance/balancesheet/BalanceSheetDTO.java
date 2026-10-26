package com.finance.dashboard.finance.balancesheet;

import java.math.BigDecimal;
import java.util.List;

public class BalanceSheetDTO {
    private BigDecimal currentAssets;
    private BigDecimal nonCurrentAssets;
    private BigDecimal totalAssets;

    private BigDecimal currentLiabilities;
    private BigDecimal nonCurrentLiabilities;
    private BigDecimal totalLiabilities;

    private BigDecimal totalEquity;
    private BigDecimal totalLiabilitiesAndEquity;

    private boolean equationBalanced;
    private BigDecimal discrepancy;

    // Capital structure ratios
    private BigDecimal currentRatio;
    private BigDecimal debtToEquityRatio;
    private BigDecimal debtToAssetsRatio;

    private List<BalanceSheetItem> items;

    public BalanceSheetDTO() {}

    public BigDecimal getCurrentAssets() { return currentAssets; }
    public void setCurrentAssets(BigDecimal currentAssets) { this.currentAssets = currentAssets; }

    public BigDecimal getNonCurrentAssets() { return nonCurrentAssets; }
    public void setNonCurrentAssets(BigDecimal nonCurrentAssets) { this.nonCurrentAssets = nonCurrentAssets; }

    public BigDecimal getTotalAssets() { return totalAssets; }
    public void setTotalAssets(BigDecimal totalAssets) { this.totalAssets = totalAssets; }

    public BigDecimal getCurrentLiabilities() { return currentLiabilities; }
    public void setCurrentLiabilities(BigDecimal currentLiabilities) { this.currentLiabilities = currentLiabilities; }

    public BigDecimal getNonCurrentLiabilities() { return nonCurrentLiabilities; }
    public void setNonCurrentLiabilities(BigDecimal nonCurrentLiabilities) { this.nonCurrentLiabilities = nonCurrentLiabilities; }

    public BigDecimal getTotalLiabilities() { return totalLiabilities; }
    public void setTotalLiabilities(BigDecimal totalLiabilities) { this.totalLiabilities = totalLiabilities; }

    public BigDecimal getTotalEquity() { return totalEquity; }
    public void setTotalEquity(BigDecimal totalEquity) { this.totalEquity = totalEquity; }

    public BigDecimal getTotalLiabilitiesAndEquity() { return totalLiabilitiesAndEquity; }
    public void setTotalLiabilitiesAndEquity(BigDecimal totalLiabilitiesAndEquity) { this.totalLiabilitiesAndEquity = totalLiabilitiesAndEquity; }

    public boolean isEquationBalanced() { return equationBalanced; }
    public void setEquationBalanced(boolean equationBalanced) { this.equationBalanced = equationBalanced; }

    public BigDecimal getDiscrepancy() { return discrepancy; }
    public void setDiscrepancy(BigDecimal discrepancy) { this.discrepancy = discrepancy; }

    public BigDecimal getCurrentRatio() { return currentRatio; }
    public void setCurrentRatio(BigDecimal currentRatio) { this.currentRatio = currentRatio; }

    public BigDecimal getDebtToEquityRatio() { return debtToEquityRatio; }
    public void setDebtToEquityRatio(BigDecimal debtToEquityRatio) { this.debtToEquityRatio = debtToEquityRatio; }

    public BigDecimal getDebtToAssetsRatio() { return debtToAssetsRatio; }
    public void setDebtToAssetsRatio(BigDecimal debtToAssetsRatio) { this.debtToAssetsRatio = debtToAssetsRatio; }

    public List<BalanceSheetItem> getItems() { return items; }
    public void setItems(List<BalanceSheetItem> items) { this.items = items; }
}
