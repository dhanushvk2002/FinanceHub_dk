package com.finance.dashboard.finance.expenses;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ExpenseService {

    private final OperatingExpenseRepository repository;

    public ExpenseService(OperatingExpenseRepository repository) {
        this.repository = repository;
    }

    public List<OperatingExpense> getAll(Long periodId, String category, String search, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return repository.findByExpenseDateBetween(startDate, endDate);
        }
        if (periodId != null) {
            return repository.findByPeriodId(periodId);
        }
        if (category != null && !category.trim().isEmpty()) {
            return repository.findByExpenseCategory(category.trim());
        }
        if (search != null && !search.trim().isEmpty()) {
            return repository.findByVendorNameContainingIgnoreCase(search.trim());
        }
        return repository.findAll();
    }

    public OperatingExpense getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operating expense not found with id: " + id));
    }

    @Transactional
    public OperatingExpense create(OperatingExpense expense) {
        if (expense.getApprovalStatus() == null) {
            expense.setApprovalStatus("APPROVED");
        }
        if (expense.getPaymentStatus() == null) {
            expense.setPaymentStatus("PAID");
        }
        return repository.save(expense);
    }

    @Transactional
    public OperatingExpense update(Long id, OperatingExpense updated) {
        OperatingExpense existing = getById(id);
        existing.setExpenseCategory(updated.getExpenseCategory());
        existing.setDepartment(updated.getDepartment());
        existing.setVendorName(updated.getVendorName());
        existing.setExpenseDate(updated.getExpenseDate());
        existing.setAmount(updated.getAmount());
        existing.setDescription(updated.getDescription());
        existing.setApprovalStatus(updated.getApprovalStatus());
        existing.setPaymentStatus(updated.getPaymentStatus());
        existing.setApprovedBy(updated.getApprovedBy());
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        OperatingExpense expense = getById(id);
        repository.delete(expense);
    }

    public Map<String, Object> getAnalytics(Long periodId) {
        BigDecimal total = repository.sumAmountByPeriodId(periodId);
        List<Object[]> catRows = repository.sumByCategory();
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Object[] row : catRows) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0]);
            map.put("total", row[1]);
            categoryBreakdown.add(map);
        }

        List<Object[]> deptRows = repository.sumByDepartment();
        List<Map<String, Object>> departmentBreakdown = new ArrayList<>();
        for (Object[] row : deptRows) {
            Map<String, Object> map = new HashMap<>();
            map.put("department", row[0]);
            map.put("total", row[1]);
            departmentBreakdown.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalExpenses", total);
        result.put("categoryBreakdown", categoryBreakdown);
        result.put("departmentBreakdown", departmentBreakdown);
        return result;
    }
}
