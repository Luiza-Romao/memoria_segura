package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Usuario;
import com.idoso.memoria_segura.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Usuario.
 *
 * Mudancas em relacao ao original:
 * - CRUD completo (GET, POST, PUT, DELETE) em vez de apenas listar/salvar.
 * - Endpoint /usuarios/login simples para autenticar o front (sem
 *   criptografia ainda — adequado para projeto da disciplina, NAO
 *   para producao).
 * - @CrossOrigin removido daqui: agora ha um CorsConfig global.
 * - @Valid para validar o corpo da requisicao.
 */
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario salvar(@Valid @RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Usuario dados) {
        return repository.findById(id)
                .map(u -> {
                    u.setNome(dados.getNome());
                    u.setEmail(dados.getEmail());
                    u.setSenha(dados.getSenha());
                    u.setTipo(dados.getTipo());
                    return ResponseEntity.ok(repository.save(u));
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

    /**
     * Login simples por email + senha (texto puro).
     * Suficiente para fins didaticos; NAO use assim em producao.
     */
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        return repository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email)
                          && u.getSenha().equals(senha))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
