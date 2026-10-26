package com.finance.dashboard.finance.gst;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "gst_invoices")
public class GstInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Invoice number is required")
    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @NotNull(message = "Invoice date is required")
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "invoice_type", length = 20)
    private String invoiceType = "B2B"; // B2B, B2C, EXPORT, REVERSE_CHARGE

    @NotBlank(message = "Customer/Supplier name is required")
    @Column(name = "customer_supplier_name", nullable = false, length = 150)
    private String customerSupplierName;

    @NotBlank(message = "GSTIN is required")
    @Column(nullable = false, length = 20)
    private String gstin;

    @NotBlank(message = "Place of supply is required")
    @Column(name = "place_of_supply", nullable = false, length = 100)
    private String placeOfSupply;

    @NotNull(message = "Taxable value is required")
    @Column(name = "taxable_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal taxableValue;

    @Column(name = "cgst_rate", precision = 5, scale = 2)
    private BigDecimal cgstRate = BigDecimal.ZERO;

    @Column(name = "cgst_amount", precision = 15, scale = 2)
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @Column(name = "sgst_rate", precision = 5, scale = 2)
    private BigDecimal sgstRate = BigDecimal.ZERO;

    @Column(name = "sgst_amount", precision = 15, scale = 2)
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @Column(name = "igst_rate", precision = 5, scale = 2)
    private BigDecimal igstRate = BigDecimal.ZERO;

    @Column(name = "igst_amount", precision = 15, scale = 2)
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @Column(name = "total_invoice_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalInvoiceAmount;

    @Column(name = "filing_status", length = 30)
    private String filingStatus = "PENDING"; // PENDING, FILED, RECONCILED

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public GstInvoice() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public String getInvoiceType() { return invoiceType; }
    public void setInvoiceType(String invoiceType) { this.invoiceType = invoiceType; }

    public String getCustomerSupplierName() { return customerSupplierName; }
    public void setCustomerSupplierName(String customerSupplierName) { this.customerSupplierName = customerSupplierName; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getPlaceOfSupply() { return placeOfSupply; }
    public void setPlaceOfSupply(String placeOfSupply) { this.placeOfSupply = placeOfSupply; }

    public BigDecimal getTaxableValue() { return taxableValue; }
    public void setTaxableValue(BigDecimal taxableValue) { this.taxableValue = taxableValue; }

    public BigDecimal getCgstRate() { return cgstRate; }
    public void setCgstRate(BigDecimal cgstRate) { this.cgstRate = cgstRate; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstRate() { return sgstRate; }
    public void setSgstRate(BigDecimal sgstRate) { this.sgstRate = sgstRate; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getIgstRate() { return igstRate; }
    public void setIgstRate(BigDecimal igstRate) { this.igstRate = igstRate; }

    public BigDecimal getIgstAmount() { return igstAmount; }
    public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }

    public BigDecimal getTotalInvoiceAmount() { return totalInvoiceAmount; }
    public void setTotalInvoiceAmount(BigDecimal totalInvoiceAmount) { this.totalInvoiceAmount = totalInvoiceAmount; }

    public String getFilingStatus() { return filingStatus; }
    public void setFilingStatus(String filingStatus) { this.filingStatus = filingStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
