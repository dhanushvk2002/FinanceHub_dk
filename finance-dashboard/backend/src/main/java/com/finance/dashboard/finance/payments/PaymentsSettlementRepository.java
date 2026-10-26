package com.finance.dashboard.finance.payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentsSettlementRepository extends JpaRepository<PaymentsSettlement, Long> {
    Optional<PaymentsSettlement> findByPaymentRef(String paymentRef);
    List<PaymentsSettlement> findByGateway(String gateway);
    List<PaymentsSettlement> findByReconciliationStatus(String status);

    @Query("SELECT COALESCE(SUM(p.grossAmount), 0) FROM PaymentsSettlement p")
    BigDecimal sumTotalGrossVolume();

    @Query("SELECT COALESCE(SUM(p.gatewayFee), 0) FROM PaymentsSettlement p")
    BigDecimal sumTotalGatewayFees();

    @Query("SELECT COALESCE(SUM(p.settlementAmount), 0) FROM PaymentsSettlement p WHERE p.reconciliationStatus = 'SETTLED'")
    BigDecimal sumTotalSettledAmount();
}
