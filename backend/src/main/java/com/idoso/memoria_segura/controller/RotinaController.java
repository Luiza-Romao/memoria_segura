package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Rotina;
import com.idoso.memoria_segura.repository.RotinaRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller de Rotina diaria.
 * Nao existia no projeto original — adicionei junto com a entidade
 * para que a tela /rotina do frontend funcione de ponta a ponta.
 */
@RestController
@RequestMapping("/rotinas")
public class RotinaController {

    private final RotinaRepository repository;

    public RotinaController(RotinaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Rotina> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rotina> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Rotina salvar(@Valid @RequestBody Rotina rotina) {
        return repository.save(rotina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rotina> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Rotina dados) {
        return repository.findById(id)
                .map(r -> {
                    r.setAtividade(dados.getAtividade());
                    r.setHorario(dados.getHorario());
                    r.setDescricao(dados.getDescricao());
                    r.setConcluida(dados.getConcluida());
                    return ResponseEntity.ok(repository.save(r));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/concluida")
    public ResponseEntity<Rotina> alternarConcluida(@PathVariable Long id) {
        return repository.findById(id)
                .map(r -> {
                    r.setConcluida(!Boolean.TRUE.equals(r.getConcluida()));
                    return ResponseEntity.ok(repository.save(r));
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
