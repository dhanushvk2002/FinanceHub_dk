package com.finance.dashboard.finance.period;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_periods")
public class FinancialPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period_name", nullable = false, unique = true, length = 50)
    private String periodName;

    @Column(name = "fiscal_year", nullable = false)
    private Integer fiscalYear;

    @Column(length = 10)
    private String quarter;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "is_closed")
    private Boolean isClosed = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public FinancialPeriod() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPeriodName() { return periodName; }
    public void setPeriodName(String periodName) { this.periodName = periodName; }

    public Integer getFiscalYear() { return fiscalYear; }
    public void setFiscalYear(Integer fiscalYear) { this.fiscalYear = fiscalYear; }

    public String getQuarter() { return quarter; }
    public void setQuarter(String quarter) { this.quarter = quarter; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Boolean getIsClosed() { return isClosed; }
    public void setIsClosed(Boolean closed) { isClosed = closed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
