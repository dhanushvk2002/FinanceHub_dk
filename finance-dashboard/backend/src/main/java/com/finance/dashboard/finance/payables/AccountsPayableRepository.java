package com.finance.dashboard.finance.payables;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountsPayableRepository extends JpaRepository<AccountsPayable, Long> {
    Optional<AccountsPayable> findByBillNumber(String billNumber);
    List<AccountsPayable> findByStatus(String status);
    List<AccountsPayable> findByVendorNameContainingIgnoreCase(String vendorName);

    @Query("SELECT COALESCE(SUM(p.outstandingBalance), 0) FROM AccountsPayable p WHERE p.status != 'PAID'")
    BigDecimal sumTotalOutstanding();

    @Query("SELECT COALESCE(SUM(p.outstandingBalance), 0) FROM AccountsPayable p WHERE p.status = 'OVERDUE' OR (p.status != 'PAID' AND p.dueDate < CURRENT_DATE)")
    BigDecimal sumOverduePayables();
}
