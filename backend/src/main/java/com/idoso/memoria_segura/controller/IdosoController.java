package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Idoso;
import com.idoso.memoria_segura.repository.IdosoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller de Idoso.
 * Novo — nao existia no projeto original.
 */
@RestController
@RequestMapping("/idosos")
public class IdosoController {

    private final IdosoRepository repository;

    public IdosoController(IdosoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Idoso> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Idoso> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Idoso salvar(@Valid @RequestBody Idoso idoso) {
        return repository.save(idoso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Idoso> atualizar(@PathVariable Long id,
                                           @Valid @RequestBody Idoso dados) {
        return repository.findById(id)
                .map(i -> {
                    i.setNome(dados.getNome());
                    i.setIdade(dados.getIdade());
                    i.setTipoSanguineo(dados.getTipoSanguineo());
                    i.setCondicoes(dados.getCondicoes());
                    i.setAlergias(dados.getAlergias());
                    i.setContatoEmergencia(dados.getContatoEmergencia());
                    return ResponseEntity.ok(repository.save(i));
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
