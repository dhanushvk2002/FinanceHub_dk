package com.finance.dashboard.finance.payments;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments_settlement")
public class PaymentsSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_ref", nullable = false, unique = true, length = 100)
    private String paymentRef;

    @Column(name = "invoice_ref", length = 50)
    private String invoiceRef;

    @NotBlank(message = "Payment method is required")
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CREDIT_CARD, WIRE_TRANSFER, UPI, ACH, STRIPE, RAZORPAY

    @NotBlank(message = "Gateway is required")
    @Column(nullable = false, length = 50)
    private String gateway; // Stripe, Razorpay, Chase Paymentech, Adyen

    @NotNull(message = "Gross amount is required")
    @Column(name = "gross_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossAmount;

    @NotNull(message = "Gateway fee is required")
    @Column(name = "gateway_fee", nullable = false, precision = 15, scale = 2)
    private BigDecimal gatewayFee = BigDecimal.ZERO;

    @Column(name = "settlement_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal settlementAmount;

    @Column(name = "settlement_date")
    private LocalDate settlementDate;

    @Column(name = "reconciliation_status", length = 30)
    private String reconciliationStatus = "SETTLED"; // PENDING, SETTLED, DISCREPANCY

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public PaymentsSettlement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }

    public String getInvoiceRef() { return invoiceRef; }
    public void setInvoiceRef(String invoiceRef) { this.invoiceRef = invoiceRef; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getGateway() { return gateway; }
    public void setGateway(String gateway) { this.gateway = gateway; }

    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }

    public BigDecimal getGatewayFee() { return gatewayFee; }
    public void setGatewayFee(BigDecimal gatewayFee) { this.gatewayFee = gatewayFee; }

    public BigDecimal getSettlementAmount() { return settlementAmount; }
    public void setSettlementAmount(BigDecimal settlementAmount) { this.settlementAmount = settlementAmount; }

    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }

    public String getReconciliationStatus() { return reconciliationStatus; }
    public void setReconciliationStatus(String reconciliationStatus) { this.reconciliationStatus = reconciliationStatus; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
