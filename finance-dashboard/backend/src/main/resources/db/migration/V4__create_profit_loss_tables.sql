-- ===================================================================
-- V4__create_profit_loss_tables.sql
-- Submodule: Profit & Loss Statement (P&L) Ledger & Snapshots
-- ===================================================================

CREATE TABLE IF NOT EXISTS profit_loss_statements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    statement_name VARCHAR(150) NOT NULL,
    total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cost_of_goods_sold DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    gross_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    operating_expenses DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    operating_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    other_income DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    interest_expense DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    tax_expense DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    net_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    statement_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'FINAL',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pl_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed P&L statements matching the 4 fiscal quarters
INSERT INTO profit_loss_statements (period_id, statement_name, total_revenue, cost_of_goods_sold, gross_profit, operating_expenses, operating_profit, other_income, interest_expense, tax_expense, net_profit, statement_date, status, notes) VALUES
(1, 'Q1-2026 Audited Income Statement', 310000.00, 42000.00, 268000.00, 100000.00, 168000.00, 5000.00, 2000.00, 35910.00, 135090.00, '2026-03-31', 'FINAL', 'Q1 FY26 Audited P&L close'),
(2, 'Q2-2026 Audited Income Statement', 345000.00, 46000.00, 299000.00, 102000.00, 197000.00, 6000.00, 2000.00, 42210.00, 158790.00, '2026-06-30', 'FINAL', 'Q2 FY26 Audited P&L close'),
(3, 'Q3-2026 Audited Income Statement', 370000.00, 49000.00, 321000.00, 103000.00, 218000.00, 7000.00, 2000.00, 46830.00, 176170.00, '2026-09-30', 'FINAL', 'Q3 FY26 Audited P&L close'),
(4, 'Q4-2026 Executive P&L Snapshot', 430000.00, 54450.00, 375550.00, 111400.00, 264150.00, 8500.00, 2250.00, 56784.00, 213616.00, '2026-10-22', 'ACTIVE', 'Q4 FY26 Current Running P&L');
