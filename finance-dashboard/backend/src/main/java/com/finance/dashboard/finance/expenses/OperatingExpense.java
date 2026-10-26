package com.finance.dashboard.finance.expenses;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "operating_expenses")
public class OperatingExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Expense category is required")
    @Column(name = "expense_category", nullable = false, length = 100)
    private String expenseCategory;

    @NotBlank(message = "Department is required")
    @Column(nullable = false, length = 100)
    private String department;

    @NotBlank(message = "Vendor name is required")
    @Column(name = "vendor_name", nullable = false, length = 150)
    private String vendorName;

    @NotNull(message = "Expense date is required")
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "approval_status", length = 30)
    private String approvalStatus = "APPROVED"; // PENDING, APPROVED, REJECTED

    @Column(name = "payment_status", length = 30)
    private String paymentStatus = "PAID"; // PENDING, PAID, OVERDUE

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public OperatingExpense() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinancialPeriod getPeriod() { return period; }
    public void setPeriod(FinancialPeriod period) { this.period = period; }

    public String getExpenseCategory() { return expenseCategory; }
    public void setExpenseCategory(String expenseCategory) { this.expenseCategory = expenseCategory; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
