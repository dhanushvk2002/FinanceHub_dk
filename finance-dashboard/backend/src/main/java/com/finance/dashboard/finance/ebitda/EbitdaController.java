package com.finance.dashboard.finance.ebitda;

import com.finance.dashboard.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ebitda")
public class EbitdaController {

    private final EbitdaService service;

    public EbitdaController(EbitdaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<EbitdaDTO>> getEbitda(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.calculateEbitdaAndBridge(periodId)));
    }
}
