package com.idoso.memoria_segura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cuidador cadastrado para acompanhar um idoso.
 * Entidade nova — nao existia no projeto original.
 */
@Entity
@Table(name = "cuidadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cuidador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    @NotBlank(message = "Telefone e obrigatorio")
    private String telefone;

    private String email;

    /** Parentesco ou relacao: "Filha", "Cuidadora profissional", "Vizinho", etc. */
    private String relacao;
}
