package com.finance.dashboard.finance.forecasting;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/forecasts")
public class ForecastController {

    private final ForecastService service;

    public ForecastController(ForecastService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialForecast>>> getAll(
            @RequestParam(required = false) String modelName) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(modelName)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialForecast>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FinancialForecast>> create(@Valid @RequestBody FinancialForecast forecast) {
        FinancialForecast created = service.create(forecast);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Forecast model created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FinancialForecast>> update(
            @PathVariable Long id,
            @Valid @RequestBody FinancialForecast forecast) {
        FinancialForecast updated = service.update(id, forecast);
        return ResponseEntity.ok(ApiResponse.ok("Forecast model updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Forecast model deleted successfully", null));
    }
}
