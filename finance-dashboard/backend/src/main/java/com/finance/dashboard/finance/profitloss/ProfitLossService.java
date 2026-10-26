package com.finance.dashboard.finance.profitloss;

import com.finance.dashboard.finance.cogs.CogsRepository;
import com.finance.dashboard.finance.expenses.OperatingExpenseRepository;
import com.finance.dashboard.finance.period.FinancialPeriod;
import com.finance.dashboard.finance.period.FinancialPeriodRepository;
import com.finance.dashboard.finance.revenue.RevenueRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ProfitLossService {

    private final RevenueRepository revenueRepository;
    private final CogsRepository cogsRepository;
    private final OperatingExpenseRepository expenseRepository;
    private final FinancialPeriodRepository periodRepository;
    private final ProfitLossRepository profitLossRepository;

    public ProfitLossService(RevenueRepository revenueRepository,
                             CogsRepository cogsRepository,
                             OperatingExpenseRepository expenseRepository,
                             FinancialPeriodRepository periodRepository,
                             ProfitLossRepository profitLossRepository) {
        this.revenueRepository = revenueRepository;
        this.cogsRepository = cogsRepository;
        this.expenseRepository = expenseRepository;
        this.periodRepository = periodRepository;
        this.profitLossRepository = profitLossRepository;
    }

    public java.util.List<ProfitLossStatement> getAllStatements() {
        return profitLossRepository.findAllByOrderByStatementDateDesc();
    }

    public ProfitLossDTO calculateProfitLoss(Long periodId) {
        FinancialPeriod currentPeriod = null;
        if (periodId != null) {
            currentPeriod = periodRepository.findById(periodId).orElse(null);
        } else {
            currentPeriod = periodRepository.findFirstByIsClosedFalseOrderByStartDateAsc().orElse(null);
        }

        Long curPeriodId = (currentPeriod != null) ? currentPeriod.getId() : null;
        String curPeriodName = (currentPeriod != null) ? currentPeriod.getPeriodName() : "Q4-2026 (All)";

        BigDecimal revenue = revenueRepository.sumNetAmountByPeriodId(curPeriodId);
        if (revenue == null) revenue = BigDecimal.ZERO;

        BigDecimal cogs = cogsRepository.sumTotalCogsByPeriodId(curPeriodId);
        if (cogs == null) cogs = BigDecimal.ZERO;

        BigDecimal grossProfit = revenue.subtract(cogs).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grossMargin = (revenue.compareTo(BigDecimal.ZERO) > 0)
                ? grossProfit.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal opex = expenseRepository.sumAmountByPeriodId(curPeriodId);
        if (opex == null) opex = BigDecimal.ZERO;

        BigDecimal operatingProfit = grossProfit.subtract(opex).setScale(2, RoundingMode.HALF_UP);
        BigDecimal operatingMargin = (revenue.compareTo(BigDecimal.ZERO) > 0)
                ? operatingProfit.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal otherIncome = new BigDecimal("4500.00");
        BigDecimal interestExpense = new BigDecimal("1600.00");

        BigDecimal taxableIncome = operatingProfit.add(otherIncome).subtract(interestExpense);
        BigDecimal taxes = BigDecimal.ZERO;
        if (taxableIncome.compareTo(BigDecimal.ZERO) > 0) {
            taxes = taxableIncome.multiply(new BigDecimal("0.21")).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal netProfit = taxableIncome.subtract(taxes).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netProfitMargin = (revenue.compareTo(BigDecimal.ZERO) > 0)
                ? netProfit.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Baseline previous period benchmark (Q3-2026)
        BigDecimal prevRevenue = new BigDecimal("390000.00");
        BigDecimal prevCogs = new BigDecimal("125000.00");
        BigDecimal prevGrossProfit = prevRevenue.subtract(prevCogs);
        BigDecimal prevOpex = new BigDecimal("155000.00");
        BigDecimal prevNetProfit = new BigDecimal("86900.00");

        BigDecimal revGrowth = (prevRevenue.compareTo(BigDecimal.ZERO) > 0)
                ? revenue.subtract(prevRevenue).multiply(BigDecimal.valueOf(100)).divide(prevRevenue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal netProfitGrowth = (prevNetProfit.compareTo(BigDecimal.ZERO) > 0)
                ? netProfit.subtract(prevNetProfit).multiply(BigDecimal.valueOf(100)).divide(prevNetProfit, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        ProfitLossDTO dto = new ProfitLossDTO();
        dto.setPeriodName(curPeriodName);
        dto.setPreviousPeriodName("Q3-2026");
        dto.setTotalRevenue(revenue);
        dto.setCostOfGoodsSold(cogs);
        dto.setGrossProfit(grossProfit);
        dto.setGrossMarginPercentage(grossMargin);
        dto.setOperatingExpenses(opex);
        dto.setOperatingProfit(operatingProfit);
        dto.setOperatingMarginPercentage(operatingMargin);
        dto.setOtherIncome(otherIncome);
        dto.setInterestExpense(interestExpense);
        dto.setTaxes(taxes);
        dto.setNetProfit(netProfit);
        dto.setNetProfitMarginPercentage(netProfitMargin);
        dto.setPrevRevenue(prevRevenue);
        dto.setPrevCogs(prevCogs);
        dto.setPrevGrossProfit(prevGrossProfit);
        dto.setPrevOpex(prevOpex);
        dto.setPrevNetProfit(prevNetProfit);
        dto.setRevenueGrowthPercentage(revGrowth);
        dto.setNetProfitGrowthPercentage(netProfitGrowth);
        return dto;
    }
}
