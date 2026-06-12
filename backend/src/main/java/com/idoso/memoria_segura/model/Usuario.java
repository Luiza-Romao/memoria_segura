package com.idoso.memoria_segura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Usuario do sistema (idoso, cuidador ou familiar).
 *
 * Mudancas em relacao a versao original:
 * - Lombok (@Data, @NoArgsConstructor, @AllArgsConstructor) substitui
 *   getters/setters manuais.
 * - Validacao com @NotBlank e @Email para garantir dados consistentes.
 * - Campo "tipo" para distinguir IDOSO / CUIDADOR / FAMILIAR.
 */
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Senha e obrigatoria")
    private String senha;

    /** IDOSO, CUIDADOR ou FAMILIAR */
    private String tipo;
}
