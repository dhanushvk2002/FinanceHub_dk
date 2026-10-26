package com.finance.dashboard.finance.refunds;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds_ledger")
public class RefundsLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "refund_id", nullable = false, unique = true, length = 100)
    private String refundId;

    @NotBlank(message = "Original payment reference is required")
    @Column(name = "original_payment_ref", nullable = false, length = 100)
    private String originalPaymentRef;

    @NotBlank(message = "Customer name is required")
    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @NotNull(message = "Refund amount is required")
    @DecimalMin(value = "0.01", message = "Refund amount must be positive")
    @Column(name = "refund_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal refundAmount;

    @NotBlank(message = "Reason is required")
    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "processing_status", length = 30)
    private String processingStatus = "COMPLETED"; // INITIATED, PROCESSING, COMPLETED, FAILED

    @NotNull(message = "Processed date is required")
    @Column(name = "processed_date", nullable = false)
    private LocalDate processedDate;

    @Column(name = "gateway_refund_ref", length = 100)
    private String gatewayRefundRef;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public RefundsLedger() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRefundId() { return refundId; }
    public void setRefundId(String refundId) { this.refundId = refundId; }

    public String getOriginalPaymentRef() { return originalPaymentRef; }
    public void setOriginalPaymentRef(String originalPaymentRef) { this.originalPaymentRef = originalPaymentRef; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }

    public LocalDate getProcessedDate() { return processedDate; }
    public void setProcessedDate(LocalDate processedDate) { this.processedDate = processedDate; }

    public String getGatewayRefundRef() { return gatewayRefundRef; }
    public void setGatewayRefundRef(String gatewayRefundRef) { this.gatewayRefundRef = gatewayRefundRef; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
