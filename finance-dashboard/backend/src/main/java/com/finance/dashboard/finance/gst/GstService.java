package com.finance.dashboard.finance.gst;

import com.finance.dashboard.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class GstService {

    private static final Pattern GSTIN_PATTERN = Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");

    private final GstInvoiceRepository repository;

    public GstService(GstInvoiceRepository repository) {
        this.repository = repository;
    }

    public List<GstInvoice> getAll(String status, String search) {
        if (status != null && !status.trim().isEmpty()) {
            return repository.findByFilingStatus(status.trim().toUpperCase());
        }
        if (search != null && !search.trim().isEmpty()) {
            return repository.findByCustomerSupplierNameContainingIgnoreCase(search.trim());
        }
        return repository.findAll();
    }

    public GstInvoice getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GST invoice not found with id: " + id));
    }

    @Transactional
    public GstInvoice create(GstInvoice invoice) {
        validateAndComputeTax(invoice);
        return repository.save(invoice);
    }

    @Transactional
    public GstInvoice update(Long id, GstInvoice updated) {
        GstInvoice existing = getById(id);
        existing.setInvoiceDate(updated.getInvoiceDate());
        existing.setInvoiceType(updated.getInvoiceType());
        existing.setCustomerSupplierName(updated.getCustomerSupplierName());
        existing.setGstin(updated.getGstin());
        existing.setPlaceOfSupply(updated.getPlaceOfSupply());
        existing.setTaxableValue(updated.getTaxableValue());
        existing.setCgstRate(updated.getCgstRate());
        existing.setSgstRate(updated.getSgstRate());
        existing.setIgstRate(updated.getIgstRate());
        existing.setFilingStatus(updated.getFilingStatus());
        validateAndComputeTax(existing);
        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        GstInvoice invoice = getById(id);
        repository.delete(invoice);
    }

    private void validateAndComputeTax(GstInvoice invoice) {
        // GSTIN validation check (if not URP - unregistered person)
        if (invoice.getGstin() != null && !"URP".equalsIgnoreCase(invoice.getGstin().trim())) {
            String cleanGstin = invoice.getGstin().trim().toUpperCase();
            if (!GSTIN_PATTERN.matcher(cleanGstin).matches()) {
                throw new IllegalArgumentException("Invalid Indian GSTIN format. Expected 15 characters standard GSTIN (e.g., 27AABCT3518Q1Z1) or 'URP'");
            }
            invoice.setGstin(cleanGstin);
        }

        BigDecimal taxable = invoice.getTaxableValue() != null ? invoice.getTaxableValue() : BigDecimal.ZERO;

        BigDecimal cgstRate = invoice.getCgstRate() != null ? invoice.getCgstRate() : BigDecimal.ZERO;
        BigDecimal sgstRate = invoice.getSgstRate() != null ? invoice.getSgstRate() : BigDecimal.ZERO;
        BigDecimal igstRate = invoice.getIgstRate() != null ? invoice.getIgstRate() : BigDecimal.ZERO;

        BigDecimal cgst = taxable.multiply(cgstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal sgst = taxable.multiply(sgstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal igst = taxable.multiply(igstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        invoice.setCgstAmount(cgst);
        invoice.setSgstAmount(sgst);
        invoice.setIgstAmount(igst);

        BigDecimal total = taxable.add(cgst).add(sgst).add(igst).setScale(2, RoundingMode.HALF_UP);
        invoice.setTotalInvoiceAmount(total);

        if (invoice.getFilingStatus() == null || invoice.getFilingStatus().trim().isEmpty()) {
            invoice.setFilingStatus("PENDING");
        }
    }

    public Map<String, Object> getAnalytics() {
        BigDecimal totalTaxable = repository.sumTotalTaxableValue();
        BigDecimal totalTax = repository.sumTotalTaxCollected();
        BigDecimal totalGross = repository.sumTotalInvoiceAmount();

        Map<String, Object> res = new HashMap<>();
        res.put("totalTaxableValue", totalTaxable);
        res.put("totalTaxLiability", totalTax);
        res.put("totalInvoiceValue", totalGross);
        return res;
    }
}
