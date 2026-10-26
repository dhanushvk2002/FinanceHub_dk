package com.finance.dashboard.finance.cashflow;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class CashFlowService {

    private final CashFlowRepository repository;

    public CashFlowService(CashFlowRepository repository) {
        this.repository = repository;
    }

    public CashFlowDTO getReport(Long periodId) {
        List<CashFlowRecord> list = (periodId != null) 
                ? repository.findByPeriodId(periodId) 
                : repository.findAll();

        BigDecimal op = BigDecimal.ZERO;
        BigDecimal inv = BigDecimal.ZERO;
        BigDecimal fin = BigDecimal.ZERO;

        for (CashFlowRecord r : list) {
            BigDecimal net = r.getNetMovement() != null ? r.getNetMovement() : BigDecimal.ZERO;
            if ("OPERATING".equalsIgnoreCase(r.getActivityType())) {
                op = op.add(net);
            } else if ("INVESTING".equalsIgnoreCase(r.getActivityType())) {
                inv = inv.add(net);
            } else if ("FINANCING".equalsIgnoreCase(r.getActivityType())) {
                fin = fin.add(net);
            }
        }

        BigDecimal netCashFlow = op.add(inv).add(fin).setScale(2, RoundingMode.HALF_UP);
        BigDecimal opening = new BigDecimal("537600.00");
        BigDecimal closing = opening.add(netCashFlow).setScale(2, RoundingMode.HALF_UP);

        CashFlowDTO dto = new CashFlowDTO();
        dto.setOperatingCashFlow(op.setScale(2, RoundingMode.HALF_UP));
        dto.setInvestingCashFlow(inv.setScale(2, RoundingMode.HALF_UP));
        dto.setFinancingCashFlow(fin.setScale(2, RoundingMode.HALF_UP));
        dto.setNetCashFlow(netCashFlow);
        dto.setOpeningCashBalance(opening);
        dto.setClosingCashBalance(closing);
        dto.setRecords(list);
        return dto;
    }

    public List<CashFlowRecord> getAll(Long periodId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return repository.findByTransactionDateBetween(startDate, endDate);
        }
        if (periodId != null) {
            return repository.findByPeriodId(periodId);
        }
        return repository.findAll();
    }

    public CashFlowRecord getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cash flow record not found with id: " + id));
    }

    @Transactional
    public CashFlowRecord create(CashFlowRecord record) {
        if (record.getCashInflow() == null) record.setCashInflow(BigDecimal.ZERO);
        if (record.getCashOutflow() == null) record.setCashOutflow(BigDecimal.ZERO);
        BigDecimal net = record.getCashInflow().subtract(record.getCashOutflow()).setScale(2, RoundingMode.HALF_UP);
        record.setNetMovement(net);
        return repository.save(record);
    }

    @Transactional
    public CashFlowRecord update(Long id, CashFlowRecord updated) {
        CashFlowRecord existing = getById(id);
        existing.setActivityType(updated.getActivityType());
        existing.setItemDescription(updated.getItemDescription());
        existing.setCashInflow(updated.getCashInflow() != null ? updated.getCashInflow() : BigDecimal.ZERO);
        existing.setCashOutflow(updated.getCashOutflow() != null ? updated.getCashOutflow() : BigDecimal.ZERO);
        existing.setTransactionDate(updated.getTransactionDate());
        BigDecimal net = existing.getCashInflow().subtract(existing.getCashOutflow()).setScale(2, RoundingMode.HALF_UP);
        existing.setNetMovement(net);
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        CashFlowRecord record = getById(id);
        repository.delete(record);
    }
}
