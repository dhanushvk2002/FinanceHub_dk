package com.finance.dashboard.finance.payables;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payables")
public class PayablesController {

    private final PayablesService service;

    public PayablesController(PayablesService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountsPayable>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(status, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsPayable>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountsPayable>> create(@Valid @RequestBody AccountsPayable record) {
        AccountsPayable created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Supplier bill created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsPayable>> update(
            @PathVariable Long id,
            @Valid @RequestBody AccountsPayable record) {
        AccountsPayable updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Supplier bill updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Supplier bill deleted successfully", null));
    }
}
