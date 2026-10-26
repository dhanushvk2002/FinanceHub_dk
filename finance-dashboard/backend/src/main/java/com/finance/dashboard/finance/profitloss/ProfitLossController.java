package com.finance.dashboard.finance.profitloss;

import com.finance.dashboard.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profit-loss")
public class ProfitLossController {

    private final ProfitLossService service;

    public ProfitLossController(ProfitLossService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfitLossDTO>> getProfitLoss(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.calculateProfitLoss(periodId)));
    }

    @GetMapping("/statements")
    public ResponseEntity<ApiResponse<java.util.List<ProfitLossStatement>>> getAllStatements() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAllStatements()));
    }
}
