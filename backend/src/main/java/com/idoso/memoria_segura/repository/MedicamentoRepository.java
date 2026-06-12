package com.idoso.memoria_segura.repository;

import com.idoso.memoria_segura.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
}
