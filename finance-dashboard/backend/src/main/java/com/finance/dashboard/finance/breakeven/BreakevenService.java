package com.finance.dashboard.finance.breakeven;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class BreakevenService {

    private final BreakevenRepository repository;

    public BreakevenService(BreakevenRepository repository) {
        this.repository = repository;
    }

    public List<BreakevenDTO> getAllAnalyses() {
        List<BreakevenModel> models = repository.findAll();
        List<BreakevenDTO> list = new ArrayList<>();
        for (BreakevenModel m : models) {
            list.add(computeAnalysis(m));
        }
        return list;
    }

    public BreakevenDTO getAnalysisById(Long id) {
        BreakevenModel m = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breakeven model not found with id: " + id));
        return computeAnalysis(m);
    }

    @Transactional
    public BreakevenDTO create(BreakevenModel model) {
        BreakevenModel saved = repository.save(model);
        return computeAnalysis(saved);
    }

    @Transactional
    public BreakevenDTO update(Long id, BreakevenModel updated) {
        BreakevenModel existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breakeven model not found with id: " + id));
        existing.setModelTitle(updated.getModelTitle());
        existing.setProductOrService(updated.getProductOrService());
        existing.setSellingPricePerUnit(updated.getSellingPricePerUnit());
        existing.setVariableCostPerUnit(updated.getVariableCostPerUnit());
        existing.setMonthlyFixedCosts(updated.getMonthlyFixedCosts());
        existing.setNotes(updated.getNotes());
        BreakevenModel saved = repository.save(existing);
        return computeAnalysis(saved);
    }

    @Transactional
    public void delete(Long id) {
        BreakevenModel m = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breakeven model not found with id: " + id));
        repository.delete(m);
    }

    public BreakevenDTO computeAnalysis(BreakevenModel model) {
        BigDecimal price = model.getSellingPricePerUnit();
        BigDecimal varCost = model.getVariableCostPerUnit();
        BigDecimal fixedCosts = model.getMonthlyFixedCosts();

        BigDecimal cmPerUnit = price.subtract(varCost).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cmRatio = (price.compareTo(BigDecimal.ZERO) > 0)
                ? cmPerUnit.multiply(BigDecimal.valueOf(100)).divide(price, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BreakevenDTO dto = new BreakevenDTO();
        dto.setModel(model);
        dto.setContributionMarginPerUnit(cmPerUnit);
        dto.setContributionMarginRatio(cmRatio);

        if (cmPerUnit.compareTo(BigDecimal.ZERO) <= 0) {
            dto.setFeasible(false);
            dto.setBreakevenUnits(BigDecimal.ZERO);
            dto.setBreakevenRevenue(BigDecimal.ZERO);
            dto.setStatusMessage("Unattainable: Variable cost equals or exceeds selling price. The unit operates at a loss.");
        } else {
            BigDecimal beUnits = fixedCosts.divide(cmPerUnit, 0, RoundingMode.CEILING);
            BigDecimal beRevenue = beUnits.multiply(price).setScale(2, RoundingMode.HALF_UP);
            dto.setFeasible(true);
            dto.setBreakevenUnits(beUnits);
            dto.setBreakevenRevenue(beRevenue);
            dto.setStatusMessage("Achievable: Breakeven reached at " + beUnits.toPlainString() + " units/month.");
        }

        return dto;
    }
}
