package com.finance.dashboard.finance.cashflow;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_flow_records")
public class CashFlowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Activity type is required")
    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType; // OPERATING, INVESTING, FINANCING

    @NotBlank(message = "Item description is required")
    @Column(name = "item_description", nullable = false, length = 200)
    private String itemDescription;

    @Column(name = "cash_inflow", precision = 15, scale = 2)
    private BigDecimal cashInflow = BigDecimal.ZERO;

    @Column(name = "cash_outflow", precision = 15, scale = 2)
    private BigDecimal cashOutflow = BigDecimal.ZERO;

    @Column(name = "net_movement", nullable = false, precision = 15, scale = 2)
    private BigDecimal netMovement;

    @NotNull
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public CashFlowRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinancialPeriod getPeriod() { return period; }
    public void setPeriod(FinancialPeriod period) { this.period = period; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getItemDescription() { return itemDescription; }
    public void setItemDescription(String itemDescription) { this.itemDescription = itemDescription; }

    public BigDecimal getCashInflow() { return cashInflow; }
    public void setCashInflow(BigDecimal cashInflow) { this.cashInflow = cashInflow; }

    public BigDecimal getCashOutflow() { return cashOutflow; }
    public void setCashOutflow(BigDecimal cashOutflow) { this.cashOutflow = cashOutflow; }

    public BigDecimal getNetMovement() { return netMovement; }
    public void setNetMovement(BigDecimal netMovement) { this.netMovement = netMovement; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
