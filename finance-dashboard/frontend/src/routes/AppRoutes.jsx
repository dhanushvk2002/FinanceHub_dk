import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FinanceLayout from '../components/layout/FinanceLayout';

import Dashboard from '../pages/Dashboard';
import ProfitLoss from '../pages/ProfitLoss';
import BalanceSheet from '../pages/BalanceSheet';
import CashFlow from '../pages/CashFlow';
import RevenueIntelligence from '../pages/RevenueIntelligence';
import OperatingExpenses from '../pages/OperatingExpenses';
import CostOfGoodsSold from '../pages/CostOfGoodsSold';
import GrossProfit from '../pages/GrossProfit';
import OperatingEBITDA from '../pages/OperatingEBITDA';
import AccountsReceivable from '../pages/AccountsReceivable';
import AccountsPayable from '../pages/AccountsPayable';
import GSTInvoices from '../pages/GSTInvoices';
import PaymentsSettlement from '../pages/PaymentsSettlement';
import RefundsReversals from '../pages/RefundsReversals';
import TaxCompliance from '../pages/TaxCompliance';
import FinancialForecasting from '../pages/FinancialForecasting';
import BreakevenAnalysis from '../pages/BreakevenAnalysis';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FinanceLayout />}>
        {/* Default route redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* 16 Dedicated Finance Submodules in specified order */}
        <Route path="finance/profit-loss" element={<ProfitLoss />} />
        <Route path="finance/balance-sheet" element={<BalanceSheet />} />
        <Route path="finance/cash-flow" element={<CashFlow />} />
        <Route path="finance/revenue" element={<RevenueIntelligence />} />
        <Route path="finance/operating-expenses" element={<OperatingExpenses />} />
        <Route path="finance/cogs" element={<CostOfGoodsSold />} />
        <Route path="finance/gross-profit" element={<GrossProfit />} />
        <Route path="finance/ebitda" element={<OperatingEBITDA />} />
        <Route path="finance/accounts-receivable" element={<AccountsReceivable />} />
        <Route path="finance/accounts-payable" element={<AccountsPayable />} />
        <Route path="finance/gst-invoices" element={<GSTInvoices />} />
        <Route path="finance/payments" element={<PaymentsSettlement />} />
        <Route path="finance/refunds" element={<RefundsReversals />} />
        <Route path="finance/tax-compliance" element={<TaxCompliance />} />
        <Route path="finance/forecasting" element={<FinancialForecasting />} />
        <Route path="finance/breakeven" element={<BreakevenAnalysis />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
