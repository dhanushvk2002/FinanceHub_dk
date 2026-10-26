package com.finance.dashboard.finance.payments;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentsService {

    private final PaymentsSettlementRepository repository;

    public PaymentsService(PaymentsSettlementRepository repository) {
        this.repository = repository;
    }

    public List<PaymentsSettlement> getAll(String gateway, String status) {
        if (gateway != null && !gateway.trim().isEmpty()) {
            return repository.findByGateway(gateway.trim());
        }
        if (status != null && !status.trim().isEmpty()) {
            return repository.findByReconciliationStatus(status.trim().toUpperCase());
        }
        return repository.findAll();
    }

    public PaymentsSettlement getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment settlement record not found with id: " + id));
    }

    @Transactional
    public PaymentsSettlement create(PaymentsSettlement p) {
        if (p.getPaymentRef() == null || p.getPaymentRef().trim().isEmpty()) {
            p.setPaymentRef("PAY-" + System.currentTimeMillis());
        }
        if (repository.findByPaymentRef(p.getPaymentRef()).isPresent()) {
            throw new IllegalArgumentException("Payment reference already exists (Idempotency violation): " + p.getPaymentRef());
        }

        if (p.getGatewayFee() == null) p.setGatewayFee(BigDecimal.ZERO);
        BigDecimal netSettlement = p.getGrossAmount().subtract(p.getGatewayFee()).setScale(2, RoundingMode.HALF_UP);
        p.setSettlementAmount(netSettlement);

        if (p.getSettlementDate() == null) {
            p.setSettlementDate(LocalDate.now());
        }
        if (p.getReconciliationStatus() == null) {
            p.setReconciliationStatus("SETTLED");
        }
        return repository.save(p);
    }

    @Transactional
    public PaymentsSettlement update(Long id, PaymentsSettlement updated) {
        PaymentsSettlement existing = getById(id);
        existing.setInvoiceRef(updated.getInvoiceRef());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setGateway(updated.getGateway());
        existing.setGrossAmount(updated.getGrossAmount());
        existing.setGatewayFee(updated.getGatewayFee() != null ? updated.getGatewayFee() : BigDecimal.ZERO);

        BigDecimal netSettlement = existing.getGrossAmount().subtract(existing.getGatewayFee()).setScale(2, RoundingMode.HALF_UP);
        existing.setSettlementAmount(netSettlement);
        existing.setSettlementDate(updated.getSettlementDate());
        existing.setReconciliationStatus(updated.getReconciliationStatus());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        PaymentsSettlement p = getById(id);
        repository.delete(p);
    }

    public Map<String, Object> getAnalytics() {
        BigDecimal gross = repository.sumTotalGrossVolume();
        BigDecimal fees = repository.sumTotalGatewayFees();
        BigDecimal settled = repository.sumTotalSettledAmount();

        BigDecimal feeTakeRate = (gross.compareTo(BigDecimal.ZERO) > 0)
                ? fees.multiply(BigDecimal.valueOf(100)).divide(gross, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> res = new HashMap<>();
        res.put("totalGrossVolume", gross);
        res.put("totalGatewayFees", fees);
        res.put("totalSettledAmount", settled);
        res.put("averageFeeTakeRatePercentage", feeTakeRate);
        return res;
    }
}
