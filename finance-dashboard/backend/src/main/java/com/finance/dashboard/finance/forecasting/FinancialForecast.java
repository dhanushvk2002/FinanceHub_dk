package com.finance.dashboard.finance.forecasting;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_forecasts")
public class FinancialForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Model name is required")
    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @NotBlank(message = "Forecast month is required")
    @Column(name = "forecast_month", nullable = false, length = 20)
    private String forecastMonth; // e.g., 2026-11, 2026-12, 2027-01

    @NotNull(message = "Projected revenue is required")
    @Column(name = "projected_revenue", nullable = false, precision = 15, scale = 2)
    private BigDecimal projectedRevenue;

    @NotNull(message = "Projected OPEX is required")
    @Column(name = "projected_opex", nullable = false, precision = 15, scale = 2)
    private BigDecimal projectedOpex;

    @NotNull(message = "Projected COGS is required")
    @Column(name = "projected_cogs", nullable = false, precision = 15, scale = 2)
    private BigDecimal projectedCogs;

    @NotNull(message = "Projected cash flow is required")
    @Column(name = "projected_cash_flow", nullable = false, precision = 15, scale = 2)
    private BigDecimal projectedCashFlow;

    @Column(name = "actual_revenue", precision = 15, scale = 2)
    private BigDecimal actualRevenue = BigDecimal.ZERO;

    @Column(name = "actual_opex", precision = 15, scale = 2)
    private BigDecimal actualOpex = BigDecimal.ZERO;

    @Column(name = "revenue_growth_rate", precision = 5, scale = 2)
    private BigDecimal revenueGrowthRate = new BigDecimal("10.00");

    @Column(columnDefinition = "TEXT")
    private String assumptions;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public FinancialForecast() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getForecastMonth() { return forecastMonth; }
    public void setForecastMonth(String forecastMonth) { this.forecastMonth = forecastMonth; }

    public BigDecimal getProjectedRevenue() { return projectedRevenue; }
    public void setProjectedRevenue(BigDecimal projectedRevenue) { this.projectedRevenue = projectedRevenue; }

    public BigDecimal getProjectedOpex() { return projectedOpex; }
    public void setProjectedOpex(BigDecimal projectedOpex) { this.projectedOpex = projectedOpex; }

    public BigDecimal getProjectedCogs() { return projectedCogs; }
    public void setProjectedCogs(BigDecimal projectedCogs) { this.projectedCogs = projectedCogs; }

    public BigDecimal getProjectedCashFlow() { return projectedCashFlow; }
    public void setProjectedCashFlow(BigDecimal projectedCashFlow) { this.projectedCashFlow = projectedCashFlow; }

    public BigDecimal getActualRevenue() { return actualRevenue; }
    public void setActualRevenue(BigDecimal actualRevenue) { this.actualRevenue = actualRevenue; }

    public BigDecimal getActualOpex() { return actualOpex; }
    public void setActualOpex(BigDecimal actualOpex) { this.actualOpex = actualOpex; }

    public BigDecimal getRevenueGrowthRate() { return revenueGrowthRate; }
    public void setRevenueGrowthRate(BigDecimal revenueGrowthRate) { this.revenueGrowthRate = revenueGrowthRate; }

    public String getAssumptions() { return assumptions; }
    public void setAssumptions(String assumptions) { this.assumptions = assumptions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
