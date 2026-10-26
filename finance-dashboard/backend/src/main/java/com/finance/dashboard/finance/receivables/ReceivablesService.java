package com.finance.dashboard.finance.receivables;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class ReceivablesService {

    private final AccountsReceivableRepository repository;

    public ReceivablesService(AccountsReceivableRepository repository) {
        this.repository = repository;
    }

    public List<AccountsReceivable> getAll(String status, String search) {
        List<AccountsReceivable> list;
        if (status != null && !status.trim().isEmpty()) {
            list = repository.findByStatus(status.trim().toUpperCase());
        } else if (search != null && !search.trim().isEmpty()) {
            list = repository.findByCustomerNameContainingIgnoreCase(search.trim());
        } else {
            list = repository.findAll();
        }

        // recalculate overdue status dynamically
        LocalDate today = LocalDate.now();
        for (AccountsReceivable ar : list) {
            if (!"PAID".equalsIgnoreCase(ar.getStatus()) && !"CANCELLED".equalsIgnoreCase(ar.getStatus())) {
                if (ar.getDueDate() != null && today.isAfter(ar.getDueDate())) {
                    ar.setStatus("OVERDUE");
                }
            }
        }
        return list;
    }

    public AccountsReceivable getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice record not found with id: " + id));
    }

    @Transactional
    public AccountsReceivable create(AccountsReceivable ar) {
        if (ar.getAmountPaid() == null) ar.setAmountPaid(BigDecimal.ZERO);
        BigDecimal outstanding = ar.getTotalAmount().subtract(ar.getAmountPaid()).setScale(2, RoundingMode.HALF_UP);
        ar.setOutstandingBalance(outstanding);

        if (outstanding.compareTo(BigDecimal.ZERO) <= 0) {
            ar.setStatus("PAID");
        } else if (ar.getDueDate() != null && LocalDate.now().isAfter(ar.getDueDate())) {
            ar.setStatus("OVERDUE");
        } else if (ar.getAmountPaid().compareTo(BigDecimal.ZERO) > 0) {
            ar.setStatus("PARTIAL");
        } else {
            ar.setStatus("UNPAID");
        }
        return repository.save(ar);
    }

    @Transactional
    public AccountsReceivable update(Long id, AccountsReceivable updated) {
        AccountsReceivable existing = getById(id);
        existing.setCustomerName(updated.getCustomerName());
        existing.setCustomerEmail(updated.getCustomerEmail());
        existing.setInvoiceDate(updated.getInvoiceDate());
        existing.setDueDate(updated.getDueDate());
        existing.setTotalAmount(updated.getTotalAmount());
        existing.setAmountPaid(updated.getAmountPaid() != null ? updated.getAmountPaid() : BigDecimal.ZERO);
        existing.setNotes(updated.getNotes());

        BigDecimal outstanding = existing.getTotalAmount().subtract(existing.getAmountPaid()).setScale(2, RoundingMode.HALF_UP);
        existing.setOutstandingBalance(outstanding);

        if (outstanding.compareTo(BigDecimal.ZERO) <= 0) {
            existing.setStatus("PAID");
        } else if (existing.getDueDate() != null && LocalDate.now().isAfter(existing.getDueDate())) {
            existing.setStatus("OVERDUE");
        } else if (existing.getAmountPaid().compareTo(BigDecimal.ZERO) > 0) {
            existing.setStatus("PARTIAL");
        } else {
            existing.setStatus("UNPAID");
        }
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        AccountsReceivable ar = getById(id);
        repository.delete(ar);
    }

    public Map<String, Object> getAnalytics() {
        List<AccountsReceivable> all = getAll(null, null);
        BigDecimal totalOutstanding = BigDecimal.ZERO;
        BigDecimal totalOverdue = BigDecimal.ZERO;
        BigDecimal aging0to30 = BigDecimal.ZERO;
        BigDecimal aging31to60 = BigDecimal.ZERO;
        BigDecimal agingOver60 = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();

        for (AccountsReceivable ar : all) {
            if ("PAID".equalsIgnoreCase(ar.getStatus()) || "CANCELLED".equalsIgnoreCase(ar.getStatus())) continue;
            BigDecimal bal = ar.getOutstandingBalance() != null ? ar.getOutstandingBalance() : BigDecimal.ZERO;
            totalOutstanding = totalOutstanding.add(bal);

            if (ar.getDueDate() != null && today.isAfter(ar.getDueDate())) {
                totalOverdue = totalOverdue.add(bal);
                long days = ar.getOverdueDays();
                if (days <= 30) {
                    aging0to30 = aging0to30.add(bal);
                } else if (days <= 60) {
                    aging31to60 = aging31to60.add(bal);
                } else {
                    agingOver60 = agingOver60.add(bal);
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalOutstanding", totalOutstanding);
        result.put("totalOverdue", totalOverdue);
        result.put("aging0to30", aging0to30);
        result.put("aging31to60", aging31to60);
        result.put("agingOver60", agingOver60);
        return result;
    }
}
