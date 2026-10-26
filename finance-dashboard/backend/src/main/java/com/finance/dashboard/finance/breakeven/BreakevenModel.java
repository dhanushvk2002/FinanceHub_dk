package com.finance.dashboard.finance.breakeven;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "breakeven_models")
public class BreakevenModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Model title is required")
    @Column(name = "model_title", nullable = false, length = 150)
    private String modelTitle;

    @NotBlank(message = "Product or service name is required")
    @Column(name = "product_or_service", nullable = false, length = 150)
    private String productOrService;

    @NotNull(message = "Selling price per unit is required")
    @DecimalMin(value = "0.01", message = "Selling price must be positive")
    @Column(name = "selling_price_per_unit", nullable = false, precision = 15, scale = 2)
    private BigDecimal sellingPricePerUnit;

    @NotNull(message = "Variable cost per unit is required")
    @DecimalMin(value = "0.00")
    @Column(name = "variable_cost_per_unit", nullable = false, precision = 15, scale = 2)
    private BigDecimal variableCostPerUnit;

    @NotNull(message = "Monthly fixed costs is required")
    @DecimalMin(value = "0.00")
    @Column(name = "monthly_fixed_costs", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyFixedCosts;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public BreakevenModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModelTitle() { return modelTitle; }
    public void setModelTitle(String modelTitle) { this.modelTitle = modelTitle; }

    public String getProductOrService() { return productOrService; }
    public void setProductOrService(String productOrService) { this.productOrService = productOrService; }

    public BigDecimal getSellingPricePerUnit() { return sellingPricePerUnit; }
    public void setSellingPricePerUnit(BigDecimal sellingPricePerUnit) { this.sellingPricePerUnit = sellingPricePerUnit; }

    public BigDecimal getVariableCostPerUnit() { return variableCostPerUnit; }
    public void setVariableCostPerUnit(BigDecimal variableCostPerUnit) { this.variableCostPerUnit = variableCostPerUnit; }

    public BigDecimal getMonthlyFixedCosts() { return monthlyFixedCosts; }
    public void setMonthlyFixedCosts(BigDecimal monthlyFixedCosts) { this.monthlyFixedCosts = monthlyFixedCosts; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
