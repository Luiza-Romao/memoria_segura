package com.idoso.memoria_segura.repository;

import com.idoso.memoria_segura.model.Cuidador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuidadorRepository extends JpaRepository<Cuidador, Long> {
}
