package com.idoso.memoria_segura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Medicamento que o idoso precisa tomar.
 *
 * Mudancas:
 * - Lombok no lugar dos getters/setters.
 * - Campo "observacao" (ex: "tomar com agua", "antes das refeicoes").
 * - Campo "tomado" para marcar dose como concluida no dia.
 */
@Entity
@Table(name = "medicamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do medicamento e obrigatorio")
    private String nome;

    @NotBlank(message = "Dose e obrigatoria")
    private String dose;

    @NotBlank(message = "Horario e obrigatorio")
    private String horario;

    @Column(length = 500)
    private String observacao;

    private Boolean tomado = false;
}
