package com.finance.dashboard.finance.period;

import com.finance.dashboard.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/periods")
public class PeriodController {

    private final FinancialPeriodRepository repository;

    public PeriodController(FinancialPeriodRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FinancialPeriod>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(repository.findAll()));
    }
}
