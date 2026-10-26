package com.finance.dashboard.finance.revenue;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class RevenueService {

    private final RevenueRepository repository;

    public RevenueService(RevenueRepository repository) {
        this.repository = repository;
    }

    public List<RevenueRecord> getAll(Long periodId, String search, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return repository.findByTransactionDateBetween(startDate, endDate);
        }
        if (periodId != null) {
            return repository.findByPeriodId(periodId);
        }
        if (search != null && !search.trim().isEmpty()) {
            return repository.findByCustomerNameContainingIgnoreCase(search.trim());
        }
        return repository.findAll();
    }

    public RevenueRecord getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revenue record not found with id: " + id));
    }

    @Transactional
    public RevenueRecord create(RevenueRecord record) {
        if (record.getUnitsSold() == null || record.getUnitsSold() <= 0) {
            record.setUnitsSold(1);
        }
        if (record.getDiscountAmount() == null) {
            record.setDiscountAmount(BigDecimal.ZERO);
        }
        // Calculate gross and net using BigDecimal
        BigDecimal gross = record.getUnitPrice().multiply(BigDecimal.valueOf(record.getUnitsSold()))
                .setScale(2, RoundingMode.HALF_UP);
        record.setGrossAmount(gross);
        BigDecimal net = gross.subtract(record.getDiscountAmount()).setScale(2, RoundingMode.HALF_UP);
        record.setNetAmount(net);
        return repository.save(record);
    }

    @Transactional
    public RevenueRecord update(Long id, RevenueRecord updated) {
        RevenueRecord existing = getById(id);
        existing.setCustomerName(updated.getCustomerName());
        existing.setProductCategory(updated.getProductCategory());
        existing.setChannel(updated.getChannel());
        existing.setTransactionDate(updated.getTransactionDate());
        existing.setUnitsSold(updated.getUnitsSold() != null ? updated.getUnitsSold() : 1);
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setDiscountAmount(updated.getDiscountAmount() != null ? updated.getDiscountAmount() : BigDecimal.ZERO);

        BigDecimal gross = existing.getUnitPrice().multiply(BigDecimal.valueOf(existing.getUnitsSold()))
                .setScale(2, RoundingMode.HALF_UP);
        existing.setGrossAmount(gross);
        BigDecimal net = gross.subtract(existing.getDiscountAmount()).setScale(2, RoundingMode.HALF_UP);
        existing.setNetAmount(net);
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        RevenueRecord record = getById(id);
        repository.delete(record);
    }

    public Map<String, Object> getAnalytics(Long periodId) {
        BigDecimal totalNet = repository.sumNetAmountByPeriodId(periodId);
        List<Object[]> catRows = repository.sumByProductCategory();
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Object[] row : catRows) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0]);
            map.put("total", row[1]);
            categoryBreakdown.add(map);
        }

        List<Object[]> chanRows = repository.sumByChannel();
        List<Map<String, Object>> channelBreakdown = new ArrayList<>();
        for (Object[] row : chanRows) {
            Map<String, Object> map = new HashMap<>();
            map.put("channel", row[0]);
            map.put("total", row[1]);
            channelBreakdown.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalNet);
        result.put("categoryBreakdown", categoryBreakdown);
        result.put("channelBreakdown", channelBreakdown);
        return result;
    }
}
