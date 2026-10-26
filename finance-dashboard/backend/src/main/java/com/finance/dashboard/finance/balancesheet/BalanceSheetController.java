package com.finance.dashboard.finance.balancesheet;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/balance-sheet")
public class BalanceSheetController {

    private final BalanceSheetService service;

    public BalanceSheetController(BalanceSheetService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<BalanceSheetDTO>> getReport(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getReport(periodId)));
    }

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<List<BalanceSheetItem>>> getAllItems(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllItems(periodId)));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<BalanceSheetItem>> createItem(@Valid @RequestBody BalanceSheetItem item) {
        BalanceSheetItem created = service.createItem(item);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Balance sheet item created successfully", created));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<BalanceSheetItem>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody BalanceSheetItem item) {
        BalanceSheetItem updated = service.updateItem(id, item);
        return ResponseEntity.ok(ApiResponse.ok("Balance sheet item updated successfully", updated));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Balance sheet item deleted successfully", null));
    }
}
