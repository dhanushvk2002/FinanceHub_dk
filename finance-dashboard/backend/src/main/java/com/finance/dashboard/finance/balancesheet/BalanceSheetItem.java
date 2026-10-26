package com.finance.dashboard.finance.balancesheet;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "balance_sheet_items")
public class BalanceSheetItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Classification is mandatory")
    @Column(nullable = false, length = 50)
    private String classification; // CURRENT_ASSET, NON_CURRENT_ASSET, CURRENT_LIABILITY, NON_CURRENT_LIABILITY, EQUITY

    @NotBlank(message = "Sub-category is mandatory")
    @Column(name = "sub_category", nullable = false, length = 100)
    private String subCategory;

    @NotBlank(message = "Account name is mandatory")
    @Column(name = "account_name", nullable = false, length = 150)
    private String accountName;

    @NotNull(message = "Amount is mandatory")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "As-of date is mandatory")
    @Column(name = "as_of_date", nullable = false)
    private LocalDate asOfDate;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public BalanceSheetItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinancialPeriod getPeriod() { return period; }
    public void setPeriod(FinancialPeriod period) { this.period = period; }

    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getAsOfDate() { return asOfDate; }
    public void setAsOfDate(LocalDate asOfDate) { this.asOfDate = asOfDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
