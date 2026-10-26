package com.finance.dashboard.finance.taxcompliance;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tax_compliance_filings")
public class TaxComplianceFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tax type is required")
    @Column(name = "tax_type", nullable = false, length = 100)
    private String taxType; // Corporate Income Tax, GST GSTR-1, GST GSTR-3B, TDS / Withholding, Payroll Tax 941

    @NotBlank(message = "Jurisdiction is required")
    @Column(nullable = false, length = 100)
    private String jurisdiction; // Federal US, India, California, Delaware

    @NotBlank(message = "Tax period is required")
    @Column(name = "tax_period", nullable = false, length = 50)
    private String taxPeriod; // Q3-2026, September 2026, Annual 2025

    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotNull(message = "Estimated tax amount is required")
    @Column(name = "estimated_tax_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedTaxAmount;

    @Column(name = "amount_paid", precision = 15, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(name = "challan_acknowledgement_no", length = 100)
    private String challanAcknowledgementNo;

    @Column(length = 30)
    private String status = "PENDING"; // PENDING, FILED, PAID, OVERDUE, EXTENDED

    @Column(name = "verified_statutory_status", length = 50)
    private String verifiedStatutoryStatus = "SELF_RECORDED"; // SELF_RECORDED, AUDITOR_VERIFIED, GOVT_ACKNOWLEDGED

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public TaxComplianceFiling() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTaxType() { return taxType; }
    public void setTaxType(String taxType) { this.taxType = taxType; }

    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }

    public String getTaxPeriod() { return taxPeriod; }
    public void setTaxPeriod(String taxPeriod) { this.taxPeriod = taxPeriod; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getEstimatedTaxAmount() { return estimatedTaxAmount; }
    public void setEstimatedTaxAmount(BigDecimal estimatedTaxAmount) { this.estimatedTaxAmount = estimatedTaxAmount; }

    public BigDecimal getAmountPaid() { return amountPaid; }
    public void setAmountPaid(BigDecimal amountPaid) { this.amountPaid = amountPaid; }

    public String getChallanAcknowledgementNo() { return challanAcknowledgementNo; }
    public void setChallanAcknowledgementNo(String challanAcknowledgementNo) { this.challanAcknowledgementNo = challanAcknowledgementNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVerifiedStatutoryStatus() { return verifiedStatutoryStatus; }
    public void setVerifiedStatutoryStatus(String verifiedStatutoryStatus) { this.verifiedStatutoryStatus = verifiedStatutoryStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
