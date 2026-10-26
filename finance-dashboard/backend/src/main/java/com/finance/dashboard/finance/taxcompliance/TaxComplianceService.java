package com.finance.dashboard.finance.taxcompliance;

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
public class TaxComplianceService {

    private final TaxComplianceRepository repository;

    public TaxComplianceService(TaxComplianceRepository repository) {
        this.repository = repository;
    }

    public List<TaxComplianceFiling> getAll(String status, String jurisdiction) {
        List<TaxComplianceFiling> list;
        if (status != null && !status.trim().isEmpty()) {
            list = repository.findByStatus(status.trim().toUpperCase());
        } else if (jurisdiction != null && !jurisdiction.trim().isEmpty()) {
            list = repository.findByJurisdiction(jurisdiction.trim());
        } else {
            list = repository.findAll();
        }

        LocalDate today = LocalDate.now();
        for (TaxComplianceFiling t : list) {
            if (!"FILED".equalsIgnoreCase(t.getStatus()) && !"PAID".equalsIgnoreCase(t.getStatus())) {
                if (t.getDueDate() != null && today.isAfter(t.getDueDate())) {
                    t.setStatus("OVERDUE");
                }
            }
        }
        return list;
    }

    public TaxComplianceFiling getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tax compliance record not found with id: " + id));
    }

    @Transactional
    public TaxComplianceFiling create(TaxComplianceFiling filing) {
        if (filing.getAmountPaid() == null) filing.setAmountPaid(BigDecimal.ZERO);
        if (filing.getStatus() == null || filing.getStatus().trim().isEmpty()) {
            if (filing.getDueDate() != null && LocalDate.now().isAfter(filing.getDueDate())) {
                filing.setStatus("OVERDUE");
            } else {
                filing.setStatus("PENDING");
            }
        }
        if (filing.getVerifiedStatutoryStatus() == null) {
            filing.setVerifiedStatutoryStatus("SELF_RECORDED");
        }
        return repository.save(filing);
    }

    @Transactional
    public TaxComplianceFiling update(Long id, TaxComplianceFiling updated) {
        TaxComplianceFiling existing = getById(id);
        existing.setTaxType(updated.getTaxType());
        existing.setJurisdiction(updated.getJurisdiction());
        existing.setTaxPeriod(updated.getTaxPeriod());
        existing.setDueDate(updated.getDueDate());
        existing.setEstimatedTaxAmount(updated.getEstimatedTaxAmount());
        existing.setAmountPaid(updated.getAmountPaid() != null ? updated.getAmountPaid() : BigDecimal.ZERO);
        existing.setChallanAcknowledgementNo(updated.getChallanAcknowledgementNo());
        existing.setStatus(updated.getStatus());
        existing.setVerifiedStatutoryStatus(updated.getVerifiedStatutoryStatus());
        existing.setRemarks(updated.getRemarks());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        TaxComplianceFiling filing = getById(id);
        repository.delete(filing);
    }

    public Map<String, Object> getAnalytics() {
        BigDecimal totalObligations = repository.sumTotalTaxObligations();
        BigDecimal totalPaid = repository.sumTotalTaxesPaid();
        BigDecimal pendingLiability = totalObligations.subtract(totalPaid).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        List<TaxComplianceFiling> all = getAll(null, null);
        long totalFilings = all.size();
        long completedFilings = all.stream().filter(t -> "FILED".equalsIgnoreCase(t.getStatus()) || "PAID".equalsIgnoreCase(t.getStatus())).count();

        BigDecimal complianceRate = (totalFilings > 0)
                ? BigDecimal.valueOf(completedFilings).multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(totalFilings), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> res = new HashMap<>();
        res.put("totalTaxObligations", totalObligations);
        res.put("totalTaxesPaid", totalPaid);
        res.put("pendingTaxLiability", pendingLiability);
        res.put("complianceRatePercentage", complianceRate);
        res.put("totalFilingsCount", totalFilings);
        res.put("completedFilingsCount", completedFilings);
        return res;
    }
}
