package com.finance.dashboard.finance.receivables;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/receivables")
public class ReceivablesController {

    private final ReceivablesService service;

    public ReceivablesController(ReceivablesService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountsReceivable>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(status, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsReceivable>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountsReceivable>> create(@Valid @RequestBody AccountsReceivable record) {
        AccountsReceivable created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Customer invoice created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountsReceivable>> update(
            @PathVariable Long id,
            @Valid @RequestBody AccountsReceivable record) {
        AccountsReceivable updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Customer invoice updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer invoice deleted successfully", null));
    }
}
