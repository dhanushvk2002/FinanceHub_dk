package com.finance.dashboard.finance.cogs;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cogs_records")
public class CogsRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Product line is mandatory")
    @Column(name = "product_line", nullable = false, length = 100)
    private String productLine;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "direct_material_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal directMaterialCost;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "direct_labor_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal directLaborCost;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "manufacturing_overhead", nullable = false, precision = 15, scale = 2)
    private BigDecimal manufacturingOverhead;

    @Column(name = "freight_shipping_cost", precision = 15, scale = 2)
    private BigDecimal freightShippingCost = BigDecimal.ZERO;

    @Column(name = "total_cogs", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCogs;

    @NotNull
    @Column(name = "units_produced", nullable = false)
    private Integer unitsProduced = 1;

    @Column(name = "unit_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitCost;

    @NotNull
    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public CogsRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinancialPeriod getPeriod() { return period; }
    public void setPeriod(FinancialPeriod period) { this.period = period; }

    public String getProductLine() { return productLine; }
    public void setProductLine(String productLine) { this.productLine = productLine; }

    public BigDecimal getDirectMaterialCost() { return directMaterialCost; }
    public void setDirectMaterialCost(BigDecimal directMaterialCost) { this.directMaterialCost = directMaterialCost; }

    public BigDecimal getDirectLaborCost() { return directLaborCost; }
    public void setDirectLaborCost(BigDecimal directLaborCost) { this.directLaborCost = directLaborCost; }

    public BigDecimal getManufacturingOverhead() { return manufacturingOverhead; }
    public void setManufacturingOverhead(BigDecimal manufacturingOverhead) { this.manufacturingOverhead = manufacturingOverhead; }

    public BigDecimal getFreightShippingCost() { return freightShippingCost; }
    public void setFreightShippingCost(BigDecimal freightShippingCost) { this.freightShippingCost = freightShippingCost; }

    public BigDecimal getTotalCogs() { return totalCogs; }
    public void setTotalCogs(BigDecimal totalCogs) { this.totalCogs = totalCogs; }

    public Integer getUnitsProduced() { return unitsProduced; }
    public void setUnitsProduced(Integer unitsProduced) { this.unitsProduced = unitsProduced; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
