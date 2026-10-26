package com.finance.dashboard.finance.payables;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class PayablesService {

    private final AccountsPayableRepository repository;

    public PayablesService(AccountsPayableRepository repository) {
        this.repository = repository;
    }

    public List<AccountsPayable> getAll(String status, String search) {
        List<AccountsPayable> list;
        if (status != null && !status.trim().isEmpty()) {
            list = repository.findByStatus(status.trim().toUpperCase());
        } else if (search != null && !search.trim().isEmpty()) {
            list = repository.findByVendorNameContainingIgnoreCase(search.trim());
        } else {
            list = repository.findAll();
        }

        LocalDate today = LocalDate.now();
        for (AccountsPayable ap : list) {
            if (!"PAID".equalsIgnoreCase(ap.getStatus())) {
                if (ap.getDueDate() != null && today.isAfter(ap.getDueDate())) {
                    ap.setStatus("OVERDUE");
                }
            }
        }
        return list;
    }

    public AccountsPayable getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier bill not found with id: " + id));
    }

    @Transactional
    public AccountsPayable create(AccountsPayable ap) {
        if (ap.getAmountPaid() == null) ap.setAmountPaid(BigDecimal.ZERO);
        BigDecimal outstanding = ap.getTotalAmount().subtract(ap.getAmountPaid()).setScale(2, RoundingMode.HALF_UP);
        ap.setOutstandingBalance(outstanding);

        if (outstanding.compareTo(BigDecimal.ZERO) <= 0) {
            ap.setStatus("PAID");
        } else if (ap.getDueDate() != null && LocalDate.now().isAfter(ap.getDueDate())) {
            ap.setStatus("OVERDUE");
        } else if (ap.getStatus() == null || ap.getStatus().trim().isEmpty()) {
            ap.setStatus("PENDING");
        }
        return repository.save(ap);
    }

    @Transactional
    public AccountsPayable update(Long id, AccountsPayable updated) {
        AccountsPayable existing = getById(id);
        existing.setVendorName(updated.getVendorName());
        existing.setVendorCategory(updated.getVendorCategory());
        existing.setBillDate(updated.getBillDate());
        existing.setDueDate(updated.getDueDate());
        existing.setTotalAmount(updated.getTotalAmount());
        existing.setAmountPaid(updated.getAmountPaid() != null ? updated.getAmountPaid() : BigDecimal.ZERO);
        existing.setPaymentTerms(updated.getPaymentTerms());

        BigDecimal outstanding = existing.getTotalAmount().subtract(existing.getAmountPaid()).setScale(2, RoundingMode.HALF_UP);
        existing.setOutstandingBalance(outstanding);

        if (outstanding.compareTo(BigDecimal.ZERO) <= 0) {
            existing.setStatus("PAID");
        } else if (existing.getDueDate() != null && LocalDate.now().isAfter(existing.getDueDate())) {
            existing.setStatus("OVERDUE");
        } else {
            existing.setStatus(updated.getStatus() != null ? updated.getStatus() : "PENDING");
        }
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        AccountsPayable ap = getById(id);
        repository.delete(ap);
    }

    public Map<String, Object> getAnalytics() {
        List<AccountsPayable> all = getAll(null, null);
        BigDecimal totalOutstanding = BigDecimal.ZERO;
        BigDecimal totalOverdue = BigDecimal.ZERO;
        BigDecimal upcoming7Days = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();
        LocalDate next7Days = today.plusDays(7);

        for (AccountsPayable ap : all) {
            if ("PAID".equalsIgnoreCase(ap.getStatus())) continue;
            BigDecimal bal = ap.getOutstandingBalance() != null ? ap.getOutstandingBalance() : BigDecimal.ZERO;
            totalOutstanding = totalOutstanding.add(bal);

            if (ap.getDueDate() != null && today.isAfter(ap.getDueDate())) {
                totalOverdue = totalOverdue.add(bal);
            } else if (ap.getDueDate() != null && !ap.getDueDate().isAfter(next7Days)) {
                upcoming7Days = upcoming7Days.add(bal);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalOutstanding", totalOutstanding);
        result.put("totalOverdue", totalOverdue);
        result.put("upcomingObligations", upcoming7Days);
        return result;
    }
}
