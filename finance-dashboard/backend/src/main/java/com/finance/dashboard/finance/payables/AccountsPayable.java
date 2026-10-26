package com.finance.dashboard.finance.payables;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts_payable")
public class AccountsPayable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bill number is required")
    @Column(name = "bill_number", nullable = false, unique = true, length = 50)
    private String billNumber;

    @NotBlank(message = "Vendor name is required")
    @Column(name = "vendor_name", nullable = false, length = 150)
    private String vendorName;

    @NotBlank(message = "Vendor category is required")
    @Column(name = "vendor_category", nullable = false, length = 100)
    private String vendorCategory;

    @NotNull(message = "Bill date is required")
    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotNull(message = "Total amount is required")
    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "amount_paid", precision = 15, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(name = "outstanding_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal outstandingBalance;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, APPROVED, PAID, OVERDUE

    @Column(name = "payment_terms", length = 50)
    private String paymentTerms = "Net 30";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public AccountsPayable() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getVendorCategory() { return vendorCategory; }
    public void setVendorCategory(String vendorCategory) { this.vendorCategory = vendorCategory; }

    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public BigDecimal getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentTerms() { return paymentTerms; }
    public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
