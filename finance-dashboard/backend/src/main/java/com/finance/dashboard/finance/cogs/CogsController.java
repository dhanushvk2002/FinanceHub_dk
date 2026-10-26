package com.finance.dashboard.finance.cogs;

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
@RequestMapping("/api/v1/cogs")
public class CogsController {

    private final CogsService service;

    public CogsController(CogsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CogsRecord>>> getAll(
            @RequestParam(required = false) Long periodId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CogsRecord> list = service.getAll(periodId, search, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CogsRecord>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics(periodId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CogsRecord>> create(@Valid @RequestBody CogsRecord record) {
        CogsRecord created = service.create(record);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("COGS record created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CogsRecord>> update(
            @PathVariable Long id,
            @Valid @RequestBody CogsRecord record) {
        CogsRecord updated = service.update(id, record);
        return ResponseEntity.ok(ApiResponse.ok("COGS record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("COGS record deleted successfully", null));
    }
}
