package com.finance.dashboard.finance.breakeven;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BreakevenRepository extends JpaRepository<BreakevenModel, Long> {
}
