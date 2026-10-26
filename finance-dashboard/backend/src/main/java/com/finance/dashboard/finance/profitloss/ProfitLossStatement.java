package com.finance.dashboard.finance.profitloss;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "profit_loss_statements")
public class ProfitLossStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Statement name is required")
    @Column(name = "statement_name", nullable = false, length = 150)
    private String statementName;

    @NotNull
    @Column(name = "total_revenue", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @NotNull
    @Column(name = "cost_of_goods_sold", nullable = false, precision = 15, scale = 2)
    private BigDecimal costOfGoodsSold = BigDecimal.ZERO;

    @NotNull
    @Column(name = "gross_profit", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossProfit = BigDecimal.ZERO;

    @NotNull
    @Column(name = "operating_expenses", nullable = false, precision = 15, scale = 2)
    private BigDecimal operatingExpenses = BigDecimal.ZERO;

    @NotNull
    @Column(name = "operating_profit", nullable = false, precision = 15, scale = 2)
    private BigDecimal operatingProfit = BigDecimal.ZERO;

    @Column(name = "other_income", precision = 15, scale = 2)
    private BigDecimal otherIncome = BigDecimal.ZERO;

    @Column(name = "interest_expense", precision = 15, scale = 2)
    private BigDecimal interestExpense = BigDecimal.ZERO;

    @Column(name = "tax_expense", precision = 15, scale = 2)
    private BigDecimal taxExpense = BigDecimal.ZERO;

    @NotNull
    @Column(name = "net_profit", nullable = false, precision = 15, scale = 2)
    private BigDecimal netProfit = BigDecimal.ZERO;

    @NotNull
    @Column(name = "statement_date", nullable = false)
    private LocalDate statementDate;

    @Column(name = "status", length = 30)
    private String status = "FINAL";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public ProfitLossStatement() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinancialPeriod getPeriod() {
        return period;
    }

    public void setPeriod(FinancialPeriod period) {
        this.period = period;
    }

    public String getStatementName() {
        return statementName;
    }

    public void setStatementName(String statementName) {
        this.statementName = statementName;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getCostOfGoodsSold() {
        return costOfGoodsSold;
    }

    public void setCostOfGoodsSold(BigDecimal costOfGoodsSold) {
        this.costOfGoodsSold = costOfGoodsSold;
    }

    public BigDecimal getGrossProfit() {
        return grossProfit;
    }

    public void setGrossProfit(BigDecimal grossProfit) {
        this.grossProfit = grossProfit;
    }

    public BigDecimal getOperatingExpenses() {
        return operatingExpenses;
    }

    public void setOperatingExpenses(BigDecimal operatingExpenses) {
        this.operatingExpenses = operatingExpenses;
    }

    public BigDecimal getOperatingProfit() {
        return operatingProfit;
    }

    public void setOperatingProfit(BigDecimal operatingProfit) {
        this.operatingProfit = operatingProfit;
    }

    public BigDecimal getOtherIncome() {
        return otherIncome;
    }

    public void setOtherIncome(BigDecimal otherIncome) {
        this.otherIncome = otherIncome;
    }

    public BigDecimal getInterestExpense() {
        return interestExpense;
    }

    public void setInterestExpense(BigDecimal interestExpense) {
        this.interestExpense = interestExpense;
    }

    public BigDecimal getTaxExpense() {
        return taxExpense;
    }

    public void setTaxExpense(BigDecimal taxExpense) {
        this.taxExpense = taxExpense;
    }

    public BigDecimal getNetProfit() {
        return netProfit;
    }

    public void setNetProfit(BigDecimal netProfit) {
        this.netProfit = netProfit;
    }

    public LocalDate getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(LocalDate statementDate) {
        this.statementDate = statementDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
