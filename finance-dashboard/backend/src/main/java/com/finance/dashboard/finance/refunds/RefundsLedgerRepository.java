package com.finance.dashboard.finance.refunds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefundsLedgerRepository extends JpaRepository<RefundsLedger, Long> {
    Optional<RefundsLedger> findByRefundId(String refundId);
    List<RefundsLedger> findByOriginalPaymentRef(String paymentRef);
    List<RefundsLedger> findByProcessingStatus(String status);

    @Query("SELECT COALESCE(SUM(r.refundAmount), 0) FROM RefundsLedger r WHERE r.processingStatus = 'COMPLETED'")
    BigDecimal sumTotalRefundedAmount();
}
