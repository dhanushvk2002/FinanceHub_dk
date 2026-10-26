package com.finance.dashboard;

import com.finance.dashboard.finance.breakeven.BreakevenDTO;
import com.finance.dashboard.finance.breakeven.BreakevenModel;
import com.finance.dashboard.finance.breakeven.BreakevenService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class FinanceCalculationTests {

    @Test
    void testBreakevenCalculationFeasible() {
        BreakevenService service = new BreakevenService(null);
        BreakevenModel model = new BreakevenModel();
        model.setSellingPricePerUnit(new BigDecimal("1500.00"));
        model.setVariableCostPerUnit(new BigDecimal("825.00"));
        model.setMonthlyFixedCosts(new BigDecimal("45000.00"));

        BreakevenDTO dto = service.computeAnalysis(model);

        assertTrue(dto.isFeasible());
        assertEquals(new BigDecimal("675.00"), dto.getContributionMarginPerUnit());
        assertEquals(new BigDecimal("67"), dto.getBreakevenUnits()); // ceil(45000 / 675) = 67
        assertEquals(new BigDecimal("100500.00"), dto.getBreakevenRevenue()); // 67 * 1500 = 100500
    }

    @Test
    void testBreakevenCalculationNegativeContributionMargin() {
        BreakevenService service = new BreakevenService(null);
        BreakevenModel model = new BreakevenModel();
        model.setSellingPricePerUnit(new BigDecimal("100.00"));
        model.setVariableCostPerUnit(new BigDecimal("120.00"));
        model.setMonthlyFixedCosts(new BigDecimal("20000.00"));

        BreakevenDTO dto = service.computeAnalysis(model);

        assertFalse(dto.isFeasible());
        assertEquals(new BigDecimal("-20.00"), dto.getContributionMarginPerUnit());
        assertEquals(BigDecimal.ZERO, dto.getBreakevenUnits());
        assertTrue(dto.getStatusMessage().contains("Unattainable"));
    }

    @Test
    void testIndianGstCalculations() {
        BigDecimal taxable = new BigDecimal("100000.00");
        BigDecimal cgstRate = new BigDecimal("9.00");
        BigDecimal sgstRate = new BigDecimal("9.00");

        BigDecimal cgst = taxable.multiply(cgstRate).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal sgst = taxable.multiply(sgstRate).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal total = taxable.add(cgst).add(sgst);

        assertEquals(new BigDecimal("9000.00"), cgst);
        assertEquals(new BigDecimal("9000.00"), sgst);
        assertEquals(new BigDecimal("118000.00"), total);
    }
}
