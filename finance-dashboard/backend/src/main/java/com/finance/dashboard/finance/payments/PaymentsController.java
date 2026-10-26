package com.finance.dashboard.finance.payments;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentsController {

    private final PaymentsService service;

    public PaymentsController(PaymentsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentsSettlement>>> getAll(
            @RequestParam(required = false) String gateway,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(gateway, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentsSettlement>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentsSettlement>> create(@Valid @RequestBody PaymentsSettlement record) {
        PaymentsSettlement created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Payment transaction recorded successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentsSettlement>> update(
            @PathVariable Long id,
            @Valid @RequestBody PaymentsSettlement record) {
        PaymentsSettlement updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Payment transaction updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Payment transaction deleted successfully", null));
    }
}
