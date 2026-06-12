package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Medicamento;
import com.idoso.memoria_segura.repository.MedicamentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller de Medicamento.
 *
 * Mudancas em relacao ao original:
 * - CRUD completo (GET, POST, PUT, DELETE).
 * - Endpoint PATCH /{id}/tomado para marcar dose como concluida.
 * - @CrossOrigin removido (substituido por CorsConfig global).
 * - @Valid para validar entrada.
 */
@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {

    private final MedicamentoRepository repository;

    public MedicamentoController(MedicamentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Medicamento> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medicamento salvar(@Valid @RequestBody Medicamento medicamento) {
        return repository.save(medicamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> atualizar(@PathVariable Long id,
                                                 @Valid @RequestBody Medicamento dados) {
        return repository.findById(id)
                .map(m -> {
                    m.setNome(dados.getNome());
                    m.setDose(dados.getDose());
                    m.setHorario(dados.getHorario());
                    m.setObservacao(dados.getObservacao());
                    m.setTomado(dados.getTomado());
                    return ResponseEntity.ok(repository.save(m));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/tomado")
    public ResponseEntity<Medicamento> marcarTomado(@PathVariable Long id) {
        return repository.findById(id)
                .map(m -> {
                    m.setTomado(!Boolean.TRUE.equals(m.getTomado()));
                    return ResponseEntity.ok(repository.save(m));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
