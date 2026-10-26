package com.finance.dashboard.finance.revenue;

import com.finance.dashboard.finance.period.FinancialPeriod;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "revenue_records")
public class RevenueRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private FinancialPeriod period;

    @NotBlank(message = "Customer name is mandatory")
    @Column(name = "customer_name", nullable = false, length = 150)
    private String customerName;

    @NotBlank(message = "Product category is mandatory")
    @Column(name = "product_category", nullable = false, length = 100)
    private String productCategory;

    @NotBlank(message = "Channel is mandatory")
    @Column(nullable = false, length = 50)
    private String channel;

    @NotNull(message = "Transaction date is mandatory")
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "units_sold")
    private Integer unitsSold = 1;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = true)
    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "gross_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "net_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal netAmount;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public RevenueRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FinancialPeriod getPeriod() { return period; }
    public void setPeriod(FinancialPeriod period) { this.period = period; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Integer getUnitsSold() { return unitsSold; }
    public void setUnitsSold(Integer unitsSold) { this.unitsSold = unitsSold; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getNetAmount() { return netAmount; }
    public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
