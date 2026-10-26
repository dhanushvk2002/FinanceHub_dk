package com.finance.dashboard.finance.refunds;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/refunds")
public class RefundsController {

    private final RefundsService service;

    public RefundsController(RefundsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RefundsLedger>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentRef) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(status, paymentRef)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RefundsLedger>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RefundsLedger>> create(@Valid @RequestBody RefundsLedger record) {
        RefundsLedger created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Refund recorded successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RefundsLedger>> update(
            @PathVariable Long id,
            @Valid @RequestBody RefundsLedger record) {
        RefundsLedger updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Refund record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Refund record deleted successfully", null));
    }
}
