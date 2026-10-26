package com.finance.dashboard.finance.breakeven;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/breakeven")
public class BreakevenController {

    private final BreakevenService service;

    public BreakevenController(BreakevenService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BreakevenDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllAnalyses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BreakevenDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalysisById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BreakevenDTO>> create(@Valid @RequestBody BreakevenModel model) {
        BreakevenDTO created = service.create(model);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Breakeven model calculated and saved successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BreakevenDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody BreakevenModel model) {
        BreakevenDTO updated = service.update(id, model);
        return ResponseEntity.ok(ApiResponse.ok("Breakeven model updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Breakeven model deleted successfully", null));
    }
}
