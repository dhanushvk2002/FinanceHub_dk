package com.finance.dashboard.finance.gst;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface GstInvoiceRepository extends JpaRepository<GstInvoice, Long> {
    Optional<GstInvoice> findByInvoiceNumber(String invoiceNumber);
    List<GstInvoice> findByFilingStatus(String filingStatus);
    List<GstInvoice> findByCustomerSupplierNameContainingIgnoreCase(String name);

    @Query("SELECT COALESCE(SUM(g.taxableValue), 0) FROM GstInvoice g")
    BigDecimal sumTotalTaxableValue();

    @Query("SELECT COALESCE(SUM(g.cgstAmount + g.sgstAmount + g.igstAmount), 0) FROM GstInvoice g")
    BigDecimal sumTotalTaxCollected();

    @Query("SELECT COALESCE(SUM(g.totalInvoiceAmount), 0) FROM GstInvoice g")
    BigDecimal sumTotalInvoiceAmount();
}
