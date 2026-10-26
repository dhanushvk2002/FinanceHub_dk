package com.finance.dashboard.finance.taxcompliance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TaxComplianceRepository extends JpaRepository<TaxComplianceFiling, Long> {
    List<TaxComplianceFiling> findByStatus(String status);
    List<TaxComplianceFiling> findByJurisdiction(String jurisdiction);

    @Query("SELECT COALESCE(SUM(t.estimatedTaxAmount), 0) FROM TaxComplianceFiling t")
    BigDecimal sumTotalTaxObligations();

    @Query("SELECT COALESCE(SUM(t.amountPaid), 0) FROM TaxComplianceFiling t")
    BigDecimal sumTotalTaxesPaid();
}
