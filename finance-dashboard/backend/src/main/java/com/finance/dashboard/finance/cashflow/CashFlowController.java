package com.finance.dashboard.finance.cashflow;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cash-flow")
public class CashFlowController {

    private final CashFlowService service;

    public CashFlowController(CashFlowService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CashFlowDTO>> getReport(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getReport(periodId)));
    }

    @GetMapping("/records")
    public ResponseEntity<ApiResponse<List<CashFlowRecord>>> getAll(
            @RequestParam(required = false) Long periodId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(periodId, startDate, endDate)));
    }

    @GetMapping("/records/{id}")
    public ResponseEntity<ApiResponse<CashFlowRecord>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @PostMapping("/records")
    public ResponseEntity<ApiResponse<CashFlowRecord>> create(@Valid @RequestBody CashFlowRecord record) {
        CashFlowRecord created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Cash flow record created successfully", created));
    }

    @PutMapping("/records/{id}")
    public ResponseEntity<ApiResponse<CashFlowRecord>> update(
            @PathVariable Long id,
            @Valid @RequestBody CashFlowRecord record) {
        CashFlowRecord updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Cash flow record updated successfully", updated));
    }

    @DeleteMapping("/records/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Cash flow record deleted successfully", null));
    }
}
