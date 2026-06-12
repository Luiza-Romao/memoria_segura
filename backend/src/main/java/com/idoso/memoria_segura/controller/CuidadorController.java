package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Cuidador;
import com.idoso.memoria_segura.repository.CuidadorRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller de Cuidador.
 * Novo — nao existia no projeto original.
 */
@RestController
@RequestMapping("/cuidadores")
public class CuidadorController {

    private final CuidadorRepository repository;

    public CuidadorController(CuidadorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Cuidador> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuidador> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cuidador salvar(@Valid @RequestBody Cuidador cuidador) {
        return repository.save(cuidador);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cuidador> atualizar(@PathVariable Long id,
                                              @Valid @RequestBody Cuidador dados) {
        return repository.findById(id)
                .map(c -> {
                    c.setNome(dados.getNome());
                    c.setTelefone(dados.getTelefone());
                    c.setEmail(dados.getEmail());
                    c.setRelacao(dados.getRelacao());
                    return ResponseEntity.ok(repository.save(c));
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
