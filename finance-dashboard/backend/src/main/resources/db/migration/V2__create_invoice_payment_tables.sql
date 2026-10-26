-- ===================================================================
-- V2__create_invoice_payment_tables.sql
-- Submodules: Accounts Receivable, Accounts Payable, GST Invoices, Payments, Refunds
-- ===================================================================

-- Accounts Receivable (AR Customer Invoices)
CREATE TABLE IF NOT EXISTS accounts_receivable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0.00,
    outstanding_balance DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, OVERDUE, CANCELLED
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Accounts Payable (AP Supplier Bills)
CREATE TABLE IF NOT EXISTS accounts_payable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_name VARCHAR(150) NOT NULL,
    vendor_category VARCHAR(100) NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0.00,
    outstanding_balance DECIMAL(15,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, PAID, OVERDUE
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- GST Tax Invoices Register (India / International Tax compliant)
CREATE TABLE IF NOT EXISTS gst_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL DEFAULT 'B2B', -- B2B, B2C, EXPORT, REVERSE_CHARGE
    customer_supplier_name VARCHAR(150) NOT NULL,
    gstin VARCHAR(20) NOT NULL,
    place_of_supply VARCHAR(100) NOT NULL,
    taxable_value DECIMAL(15,2) NOT NULL,
    cgst_rate DECIMAL(5,2) DEFAULT 9.00,
    cgst_amount DECIMAL(15,2) DEFAULT 0.00,
    sgst_rate DECIMAL(5,2) DEFAULT 9.00,
    sgst_amount DECIMAL(15,2) DEFAULT 0.00,
    igst_rate DECIMAL(5,2) DEFAULT 18.00,
    igst_amount DECIMAL(15,2) DEFAULT 0.00,
    total_invoice_amount DECIMAL(15,2) NOT NULL,
    filing_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, FILED, RECONCILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments & Gateway Settlement
CREATE TABLE IF NOT EXISTS payments_settlement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_ref VARCHAR(100) NOT NULL UNIQUE,
    invoice_ref VARCHAR(50),
    payment_method VARCHAR(50) NOT NULL, -- CREDIT_CARD, WIRE_TRANSFER, UPI, ACH, STRIPE, RAZORPAY
    gateway VARCHAR(50) NOT NULL, -- Stripe, Razorpay, Chase Paymentech, Adyen
    gross_amount DECIMAL(15,2) NOT NULL,
    gateway_fee DECIMAL(15,2) NOT NULL,
    settlement_amount DECIMAL(15,2) NOT NULL,
    settlement_date DATE,
    reconciliation_status VARCHAR(30) DEFAULT 'SETTLED', -- PENDING, SETTLED, DISCREPANCY
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Refunds & Reversals Ledger
CREATE TABLE IF NOT EXISTS refunds_ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    refund_id VARCHAR(100) NOT NULL UNIQUE,
    original_payment_ref VARCHAR(100) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    refund_amount DECIMAL(15,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    processing_status VARCHAR(30) DEFAULT 'COMPLETED', -- INITIATED, PROCESSING, COMPLETED, FAILED
    processed_date DATE NOT NULL,
    gateway_refund_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed AR
INSERT INTO accounts_receivable (invoice_number, customer_name, customer_email, invoice_date, due_date, total_amount, amount_paid, outstanding_balance, status, notes) VALUES
('INV-2026-001', 'Acme Global Corp', 'billing@acmeglobal.com', '2026-09-15', '2026-10-15', 140000.00, 140000.00, 0.00, 'PAID', 'Settled via wire transfer'),
('INV-2026-002', 'Vertex Cloud Solutions', 'ap@vertexcloud.io', '2026-09-20', '2026-10-20', 60000.00, 30000.00, 30000.00, 'PARTIAL', '50% advance received'),
('INV-2026-003', 'Starlight Logistics', 'accounts@starlight.com', '2026-09-01', '2026-10-01', 33000.00, 0.00, 33000.00, 'OVERDUE', '11 days overdue - reminder sent'),
('INV-2026-004', 'Horizon Fintech', 'finance@horizonfin.com', '2026-10-05', '2026-11-05', 87000.00, 0.00, 87000.00, 'UNPAID', 'Net 30 days pending'),
('INV-2026-005', 'Zenith Healthcare', 'procure@zenithhealth.org', '2026-10-08', '2026-11-08', 110000.00, 0.00, 110000.00, 'UNPAID', 'Awaiting PO certification');

-- Seed AP
INSERT INTO accounts_payable (bill_number, vendor_name, vendor_category, bill_date, due_date, total_amount, amount_paid, outstanding_balance, status, payment_terms) VALUES
('BILL-901', 'Amazon Web Services', 'Cloud Infrastructure', '2026-09-28', '2026-10-28', 32500.00, 32500.00, 0.00, 'PAID', 'Net 30'),
('BILL-902', 'Gusto Payroll Inc', 'Payroll & HR', '2026-10-01', '2026-10-15', 85400.00, 85400.00, 0.00, 'PAID', 'Due on Receipt'),
('BILL-903', 'WeWork Management LLC', 'Office Leases', '2026-10-01', '2026-10-20', 12000.00, 0.00, 12000.00, 'APPROVED', 'Net 20'),
('BILL-904', 'Baker & McKenzie LLP', 'Legal Services', '2026-09-25', '2026-10-10', 9500.00, 0.00, 9500.00, 'OVERDUE', 'Net 15 overdue'),
('BILL-905', 'NVIDIA Enterprise hardware', 'Direct Materials COGS', '2026-10-05', '2026-11-05', 45000.00, 0.00, 45000.00, 'PENDING', 'Net 30 scheduled');

-- Seed GST Invoices
INSERT INTO gst_invoices (invoice_number, invoice_date, invoice_type, customer_supplier_name, gstin, place_of_supply, taxable_value, cgst_rate, cgst_amount, sgst_rate, sgst_amount, igst_rate, igst_amount, total_invoice_amount, filing_status) VALUES
('GST-2026-101', '2026-10-02', 'B2B', 'Tata Consultancy Services', '27AABCT3518Q1Z1', 'Maharashtra (27)', 100000.00, 9.00, 9000.00, 9.00, 9000.00, 0.00, 0.00, 118000.00, 'FILED'),
('GST-2026-102', '2026-10-05', 'B2B', 'Infosys Technologies', '29AABCI1234F1Z8', 'Karnataka (29)', 250000.00, 0.00, 0.00, 0.00, 0.00, 18.00, 45000.00, 295000.00, 'FILED'),
('GST-2026-103', '2026-10-08', 'B2B', 'Wipro Digital Enterprises', '29AAACW4992M1Z2', 'Karnataka (29)', 80000.00, 0.00, 0.00, 0.00, 0.00, 18.00, 14400.00, 94400.00, 'PENDING'),
('GST-2026-104', '2026-10-10', 'B2C', 'Retail Direct Clients India', 'URP', 'Delhi (07)', 50000.00, 9.00, 4500.00, 9.00, 4500.00, 0.00, 0.00, 59000.00, 'PENDING');

-- Seed Payments Settlement
INSERT INTO payments_settlement (payment_ref, invoice_ref, payment_method, gateway, gross_amount, gateway_fee, settlement_amount, settlement_date, reconciliation_status) VALUES
('PAY-TX-8821', 'INV-2026-001', 'WIRE_TRANSFER', 'Chase Paymentech', 140000.00, 35.00, 139965.00, '2026-10-03', 'SETTLED'),
('PAY-TX-8822', 'INV-2026-002', 'CREDIT_CARD', 'Stripe', 30000.00, 870.00, 29130.00, '2026-10-04', 'SETTLED'),
('PAY-TX-8823', 'GST-2026-101', 'UPI', 'Razorpay', 118000.00, 0.00, 118000.00, '2026-10-05', 'SETTLED'),
('PAY-TX-8824', 'INV-2026-004', 'ACH', 'Stripe', 40000.00, 250.00, 39750.00, '2026-10-09', 'PENDING');

-- Seed Refunds Ledger
INSERT INTO refunds_ledger (refund_id, original_payment_ref, customer_name, refund_amount, reason, processing_status, processed_date, gateway_refund_ref) VALUES
('REF-401', 'PAY-TX-7991', 'Global Tech Labs', 4500.00, 'Downgraded subscription tier pro-rata', 'COMPLETED', '2026-10-04', 'STR-REF-9921'),
('REF-402', 'PAY-TX-8114', 'Alpha Ventures', 2200.00, 'Duplicate billing reversal', 'COMPLETED', '2026-10-08', 'STR-REF-9934');
