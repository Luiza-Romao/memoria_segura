package com.idoso.memoria_segura.controller;

import com.idoso.memoria_segura.model.Usuario;
import com.idoso.memoria_segura.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller de Usuario.
 *
 * Endpoints:
 *  GET    /usuarios                  → lista todos
 *  GET    /usuarios/{id}             → busca por id
 *  GET    /usuarios/email/{email}    → busca por email (usado no login)
 *  GET    /usuarios/checar-email     → verifica se email ja existe (cadastro ao vivo)
 *  POST   /usuarios                  → cadastra novo usuario
 *  POST   /usuarios/login            → autentica (email + senha)
 *  PUT    /usuarios/{id}             → atualiza dados
 *  DELETE /usuarios/{id}             → remove
 */
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // ------------------------------------------------------------------
    // Leitura
    // ------------------------------------------------------------------

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

    /**
     * Checa se um email ja esta em uso — chamado pelo frontend
     * em tempo real enquanto o usuario digita no formulario de cadastro.
     * Retorna 200 com { "disponivel": true/false }.
     */
    @GetMapping("/checar-email")
    public ResponseEntity<Map<String, Boolean>> checarEmail(@RequestParam String email) {
        boolean disponivel = !repository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("disponivel", disponivel));
    }

    // ------------------------------------------------------------------
    // Cadastro
    // ------------------------------------------------------------------

    /**
     * Cadastra um novo usuario.
     * Retorna 409 Conflict se o email ja estiver cadastrado.
     */
    @PostMapping
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Usuario usuario) {
        if (repository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("erro", "Este e-mail ja esta cadastrado."));
        }
        Usuario salvo = repository.save(usuario);
        // nunca devolver a senha na resposta
        salvo.setSenha("[protegida]");
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // ------------------------------------------------------------------
    // Login
    // ------------------------------------------------------------------

    /**
     * Login simples por email + senha (texto puro — adequado para
     * fins didaticos; em producao usaria BCrypt + JWT).
     *
     * Retorna 200 com os dados do usuario (sem a senha) ou
     * 401 se as credenciais estiverem erradas.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("erro", "Email e senha sao obrigatorios."));
        }

        return repository.findByEmail(email.trim().toLowerCase())
                .filter(u -> u.getSenha().equals(senha))
                .map(u -> {
                    u.setSenha("[protegida]");
                    return ResponseEntity.ok(u);
                })
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(null));
    }

    // ------------------------------------------------------------------
    // Atualizar / Excluir
    // ------------------------------------------------------------------

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Usuario dados) {
        return repository.findById(id)
                .map(u -> {
                    // impede trocar email para um que ja existe em outro usuario
                    if (!u.getEmail().equalsIgnoreCase(dados.getEmail())
                            && repository.existsByEmail(dados.getEmail())) {
                        return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .<Object>body(Map.of("erro", "Email ja em uso."));
                    }
                    u.setNome(dados.getNome());
                    u.setEmail(dados.getEmail().trim().toLowerCase());
                    u.setSenha(dados.getSenha());
                    u.setTipo(dados.getTipo());
                    Usuario salvo = repository.save(u);
                    salvo.setSenha("[protegida]");
                    return ResponseEntity.<Object>ok(salvo);
                })
                .orElse(ResponseEntity.notFound().<Object>build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}