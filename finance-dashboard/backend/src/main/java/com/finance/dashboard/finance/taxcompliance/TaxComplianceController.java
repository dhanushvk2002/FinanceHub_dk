package com.finance.dashboard.finance.taxcompliance;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tax-compliance")
public class TaxComplianceController {

    private final TaxComplianceService service;

    public TaxComplianceController(TaxComplianceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaxComplianceFiling>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String jurisdiction) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(status, jurisdiction)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaxComplianceFiling>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaxComplianceFiling>> create(@Valid @RequestBody TaxComplianceFiling filing) {
        TaxComplianceFiling created = service.create(filing);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tax compliance obligation registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaxComplianceFiling>> update(
            @PathVariable Long id,
            @Valid @RequestBody TaxComplianceFiling filing) {
        TaxComplianceFiling updated = service.update(id, filing);
        return ResponseEntity.ok(ApiResponse.ok("Tax compliance obligation updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Tax compliance record deleted successfully", null));
    }
}
