package com.finance.dashboard.finance.cogs;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class CogsService {

    private final CogsRepository repository;

    public CogsService(CogsRepository repository) {
        this.repository = repository;
    }

    public List<CogsRecord> getAll(Long periodId, String search, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return repository.findByRecordDateBetween(startDate, endDate);
        }
        if (periodId != null) {
            return repository.findByPeriodId(periodId);
        }
        if (search != null && !search.trim().isEmpty()) {
            return repository.findByProductLineContainingIgnoreCase(search.trim());
        }
        return repository.findAll();
    }

    public CogsRecord getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("COGS record not found with id: " + id));
    }

    @Transactional
    public CogsRecord create(CogsRecord record) {
        calculateTotals(record);
        return repository.save(record);
    }

    @Transactional
    public CogsRecord update(Long id, CogsRecord updated) {
        CogsRecord existing = getById(id);
        existing.setProductLine(updated.getProductLine());
        existing.setDirectMaterialCost(updated.getDirectMaterialCost());
        existing.setDirectLaborCost(updated.getDirectLaborCost());
        existing.setManufacturingOverhead(updated.getManufacturingOverhead());
        existing.setFreightShippingCost(updated.getFreightShippingCost() != null ? updated.getFreightShippingCost() : BigDecimal.ZERO);
        existing.setUnitsProduced(updated.getUnitsProduced() != null ? updated.getUnitsProduced() : 1);
        existing.setRecordDate(updated.getRecordDate());
        calculateTotals(existing);
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        CogsRecord record = getById(id);
        repository.delete(record);
    }

    private void calculateTotals(CogsRecord record) {
        if (record.getFreightShippingCost() == null) {
            record.setFreightShippingCost(BigDecimal.ZERO);
        }
        if (record.getUnitsProduced() == null || record.getUnitsProduced() <= 0) {
            record.setUnitsProduced(1);
        }

        BigDecimal total = record.getDirectMaterialCost()
                .add(record.getDirectLaborCost())
                .add(record.getManufacturingOverhead())
                .add(record.getFreightShippingCost())
                .setScale(2, RoundingMode.HALF_UP);
        record.setTotalCogs(total);

        BigDecimal unitCost = total.divide(BigDecimal.valueOf(record.getUnitsProduced()), 2, RoundingMode.HALF_UP);
        record.setUnitCost(unitCost);
    }

    public Map<String, Object> getAnalytics(Long periodId) {
        BigDecimal total = repository.sumTotalCogsByPeriodId(periodId);
        List<Object[]> rows = repository.sumByProductLine();
        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("productLine", row[0]);
            map.put("total", row[1]);
            breakdown.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalCogs", total);
        result.put("productLineBreakdown", breakdown);
        return result;
    }
}
