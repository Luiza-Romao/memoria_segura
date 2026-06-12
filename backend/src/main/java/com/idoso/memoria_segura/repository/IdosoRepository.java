package com.idoso.memoria_segura.repository;

import com.idoso.memoria_segura.model.Idoso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdosoRepository extends JpaRepository<Idoso, Long> {
}
