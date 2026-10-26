package com.finance.dashboard.finance.grossprofit;

import com.finance.dashboard.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gross-profit")
public class GrossProfitController {

    private final GrossProfitService service;

    public GrossProfitController(GrossProfitService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<GrossProfitDTO>> getGrossProfit(
            @RequestParam(required = false) Long periodId) {
        return ResponseEntity.ok(ApiResponse.ok(service.calculateGrossProfitAndUnitEconomics(periodId)));
    }
}
