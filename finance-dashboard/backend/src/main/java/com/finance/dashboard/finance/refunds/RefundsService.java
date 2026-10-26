package com.finance.dashboard.finance.refunds;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RefundsService {

    private final RefundsLedgerRepository repository;

    public RefundsService(RefundsLedgerRepository repository) {
        this.repository = repository;
    }

    public List<RefundsLedger> getAll(String status, String paymentRef) {
        if (status != null && !status.trim().isEmpty()) {
            return repository.findByProcessingStatus(status.trim().toUpperCase());
        }
        if (paymentRef != null && !paymentRef.trim().isEmpty()) {
            return repository.findByOriginalPaymentRef(paymentRef.trim());
        }
        return repository.findAll();
    }

    public RefundsLedger getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refund record not found with id: " + id));
    }

    @Transactional
    public RefundsLedger create(RefundsLedger refund) {
        if (refund.getRefundId() == null || refund.getRefundId().trim().isEmpty()) {
            refund.setRefundId("REF-" + System.currentTimeMillis());
        }
        // Duplicate check
        if (repository.findByRefundId(refund.getRefundId()).isPresent()) {
            throw new IllegalArgumentException("Duplicate refund processing prevented: Refund ID already exists: " + refund.getRefundId());
        }

        if (refund.getProcessedDate() == null) {
            refund.setProcessedDate(LocalDate.now());
        }
        if (refund.getProcessingStatus() == null) {
            refund.setProcessingStatus("COMPLETED");
        }
        if (refund.getGatewayRefundRef() == null || refund.getGatewayRefundRef().trim().isEmpty()) {
            refund.setGatewayRefundRef("REV-" + System.currentTimeMillis());
        }
        return repository.save(refund);
    }

    @Transactional
    public RefundsLedger update(Long id, RefundsLedger updated) {
        RefundsLedger existing = getById(id);
        existing.setCustomerName(updated.getCustomerName());
        existing.setReason(updated.getReason());
        existing.setProcessingStatus(updated.getProcessingStatus());
        existing.setGatewayRefundRef(updated.getGatewayRefundRef());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        RefundsLedger refund = getById(id);
        repository.delete(refund);
    }

    public Map<String, Object> getAnalytics() {
        BigDecimal totalRefunded = repository.sumTotalRefundedAmount();
        List<RefundsLedger> all = repository.findAll();
        long completedCount = all.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getProcessingStatus())).count();
        long pendingCount = all.stream().filter(r -> "PROCESSING".equalsIgnoreCase(r.getProcessingStatus()) || "INITIATED".equalsIgnoreCase(r.getProcessingStatus())).count();

        Map<String, Object> res = new HashMap<>();
        res.put("totalRefundedAmount", totalRefunded);
        res.put("totalRefundsProcessed", completedCount);
        res.put("pendingRefundRequests", pendingCount);
        return res;
    }
}
