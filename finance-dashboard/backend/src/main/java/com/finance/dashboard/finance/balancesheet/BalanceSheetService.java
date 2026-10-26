package com.finance.dashboard.finance.balancesheet;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class BalanceSheetService {

    private final BalanceSheetRepository repository;

    public BalanceSheetService(BalanceSheetRepository repository) {
        this.repository = repository;
    }

    public BalanceSheetDTO getReport(Long periodId) {
        List<BalanceSheetItem> items = (periodId != null) 
                ? repository.findByPeriodId(periodId) 
                : repository.findAll();

        BigDecimal curAssets = BigDecimal.ZERO;
        BigDecimal nonCurAssets = BigDecimal.ZERO;
        BigDecimal curLiab = BigDecimal.ZERO;
        BigDecimal nonCurLiab = BigDecimal.ZERO;
        BigDecimal equity = BigDecimal.ZERO;

        for (BalanceSheetItem item : items) {
            BigDecimal amt = item.getAmount() != null ? item.getAmount() : BigDecimal.ZERO;
            switch (item.getClassification()) {
                case "CURRENT_ASSET":
                    curAssets = curAssets.add(amt);
                    break;
                case "NON_CURRENT_ASSET":
                    nonCurAssets = nonCurAssets.add(amt);
                    break;
                case "CURRENT_LIABILITY":
                    curLiab = curLiab.add(amt);
                    break;
                case "NON_CURRENT_LIABILITY":
                    nonCurLiab = nonCurLiab.add(amt);
                    break;
                case "EQUITY":
                    equity = equity.add(amt);
                    break;
            }
        }

        BigDecimal totalAssets = curAssets.add(nonCurAssets).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalLiab = curLiab.add(nonCurLiab).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalLiabAndEquity = totalLiab.add(equity).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discrepancy = totalAssets.subtract(totalLiabAndEquity).abs().setScale(2, RoundingMode.HALF_UP);
        boolean balanced = discrepancy.compareTo(new BigDecimal("0.05")) <= 0;

        // Ratios
        BigDecimal currentRatio = (curLiab.compareTo(BigDecimal.ZERO) > 0)
                ? curAssets.divide(curLiab, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal debtToEquity = (equity.compareTo(BigDecimal.ZERO) > 0)
                ? totalLiab.divide(equity, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal debtToAssets = (totalAssets.compareTo(BigDecimal.ZERO) > 0)
                ? totalLiab.divide(totalAssets, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BalanceSheetDTO dto = new BalanceSheetDTO();
        dto.setCurrentAssets(curAssets);
        dto.setNonCurrentAssets(nonCurAssets);
        dto.setTotalAssets(totalAssets);
        dto.setCurrentLiabilities(curLiab);
        dto.setNonCurrentLiabilities(nonCurLiab);
        dto.setTotalLiabilities(totalLiab);
        dto.setTotalEquity(equity);
        dto.setTotalLiabilitiesAndEquity(totalLiabAndEquity);
        dto.setEquationBalanced(balanced);
        dto.setDiscrepancy(discrepancy);
        dto.setCurrentRatio(currentRatio);
        dto.setDebtToEquityRatio(debtToEquity);
        dto.setDebtToAssetsRatio(debtToAssets);
        dto.setItems(items);
        return dto;
    }

    public List<BalanceSheetItem> getAllItems(Long periodId) {
        return (periodId != null) ? repository.findByPeriodId(periodId) : repository.findAll();
    }

    @Transactional
    public BalanceSheetItem createItem(BalanceSheetItem item) {
        return repository.save(item);
    }

    @Transactional
    public BalanceSheetItem updateItem(Long id, BalanceSheetItem updated) {
        BalanceSheetItem existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Balance sheet item not found with id: " + id));
        existing.setClassification(updated.getClassification());
        existing.setSubCategory(updated.getSubCategory());
        existing.setAccountName(updated.getAccountName());
        existing.setAmount(updated.getAmount());
        existing.setAsOfDate(updated.getAsOfDate());
        existing.setNotes(updated.getNotes());
        return repository.save(existing);
    }

    @Transactional
    public void deleteItem(Long id) {
        BalanceSheetItem existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Balance sheet item not found with id: " + id));
        repository.delete(existing);
    }
}
