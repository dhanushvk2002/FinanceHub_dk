package com.finance.dashboard.finance.breakeven;

import java.math.BigDecimal;

public class BreakevenDTO {
    private BreakevenModel model;
    private BigDecimal contributionMarginPerUnit;
    private BigDecimal contributionMarginRatio;
    private BigDecimal breakevenUnits;
    private BigDecimal breakevenRevenue;
    private boolean isFeasible;
    private String statusMessage;

    public BreakevenDTO() {}

    public BreakevenModel getModel() { return model; }
    public void setModel(BreakevenModel model) { this.model = model; }

    public BigDecimal getContributionMarginPerUnit() { return contributionMarginPerUnit; }
    public void setContributionMarginPerUnit(BigDecimal contributionMarginPerUnit) { this.contributionMarginPerUnit = contributionMarginPerUnit; }

    public BigDecimal getContributionMarginRatio() { return contributionMarginRatio; }
    public void setContributionMarginRatio(BigDecimal contributionMarginRatio) { this.contributionMarginRatio = contributionMarginRatio; }

    public BigDecimal getBreakevenUnits() { return breakevenUnits; }
    public void setBreakevenUnits(BigDecimal breakevenUnits) { this.breakevenUnits = breakevenUnits; }

    public BigDecimal getBreakevenRevenue() { return breakevenRevenue; }
    public void setBreakevenRevenue(BigDecimal breakevenRevenue) { this.breakevenRevenue = breakevenRevenue; }

    public boolean isFeasible() { return isFeasible; }
    public boolean getIsFeasible() { return isFeasible; }
    public void setFeasible(boolean feasible) { isFeasible = feasible; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
}
