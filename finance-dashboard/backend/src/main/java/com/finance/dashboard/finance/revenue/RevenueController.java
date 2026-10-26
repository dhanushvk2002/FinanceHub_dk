package com.finance.dashboard.finance.revenue;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/revenue")
public class RevenueController {

    private final RevenueService service;

    public RevenueController(RevenueService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RevenueRecord>>> getAll(
            @RequestParam(required = false) Long periodId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<RevenueRecord> list = service.getAll(periodId, search, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RevenueRecord>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics(periodId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RevenueRecord>> create(@Valid @RequestBody RevenueRecord record) {
        RevenueRecord created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Revenue record created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RevenueRecord>> update(
            @PathVariable Long id,
            @Valid @RequestBody RevenueRecord record) {
        RevenueRecord updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("Revenue record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Revenue record deleted successfully", null));
    }
}
