package com.finance.dashboard.finance.gst;

import com.finance.dashboard.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/gst-invoices")
public class GstController {

    private final GstService service;

    public GstController(GstService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GstInvoice>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(service.getAll(status, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GstInvoice>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(service.getAnalytics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GstInvoice>> create(@Valid @RequestBody GstInvoice invoice) {
        GstInvoice created = service.create(invoice);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("GST invoice registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GstInvoice>> update(
            @PathVariable Long id,
            @Valid @RequestBody GstInvoice invoice) {
        GstInvoice updated = service.update(id, invoice);
        return ResponseEntity.ok(ApiResponse.ok("GST invoice updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("GST invoice deleted successfully", null));
    }
}
