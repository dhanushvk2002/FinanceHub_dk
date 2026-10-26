package com.finance.dashboard.finance.receivables;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountsReceivableRepository extends JpaRepository<AccountsReceivable, Long> {
    Optional<AccountsReceivable> findByInvoiceNumber(String invoiceNumber);
    List<AccountsReceivable> findByStatus(String status);
    List<AccountsReceivable> findByCustomerNameContainingIgnoreCase(String customerName);

    @Query("SELECT COALESCE(SUM(r.outstandingBalance), 0) FROM AccountsReceivable r WHERE r.status != 'PAID' AND r.status != 'CANCELLED'")
    BigDecimal sumTotalOutstanding();

    @Query("SELECT COALESCE(SUM(r.outstandingBalance), 0) FROM AccountsReceivable r WHERE r.status = 'OVERDUE' OR (r.status != 'PAID' AND r.status != 'CANCELLED' AND r.dueDate < CURRENT_DATE)")
    BigDecimal sumOverdueReceivables();
}
