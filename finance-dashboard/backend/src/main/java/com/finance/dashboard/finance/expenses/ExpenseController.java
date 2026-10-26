package com.finance.dashboard.finance.expenses;

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
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OperatingExpense>>> getAll(
            @RequestParam(required = false) Long periodId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<OperatingExpense> list = service.getAll(periodId, category, search, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OperatingExpense>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics(periodId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OperatingExpense>> create(@Valid @RequestBody OperatingExpense expense) {
        OperatingExpense created = service.create(expense);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Operating expense created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OperatingExpense>> update(
            @PathVariable Long id,
            @Valid @RequestBody OperatingExpense expense) {
        OperatingExpense updated = service.update(id, expense);
        return ResponseEntity.ok(ApiResponse.ok("Operating expense updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Operating expense deleted successfully", null));
    }
}
