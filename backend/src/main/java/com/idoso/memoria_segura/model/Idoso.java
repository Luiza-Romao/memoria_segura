package com.idoso.memoria_segura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ficha do idoso sob cuidado.
 * Entidade nova — nao existia no projeto original.
 */
@Entity
@Table(name = "idosos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Idoso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    private String nome;

    private Integer idade;

    /** Tipo sanguineo, ex: "O+", "A-" */
    private String tipoSanguineo;

    @Column(length = 1000)
    private String condicoes;

    @Column(length = 500)
    private String alergias;

    /** Contato de emergencia (telefone). */
    private String contatoEmergencia;
}
