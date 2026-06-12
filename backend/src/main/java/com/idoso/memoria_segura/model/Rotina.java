package com.idoso.memoria_segura.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Atividade da rotina diaria do idoso.
 * Ex: "Caminhada", "Almoco", "Ligar para a familia".
 *
 * Esta entidade NAO existia no projeto original — a rota /rotina apontava
 * para uma pagina sem backend correspondente. Adicionei o CRUD completo.
 */
@Entity
@Table(name = "rotinas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rotina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Atividade e obrigatoria")
    private String atividade;

    @NotBlank(message = "Horario e obrigatorio")
    private String horario;

    @Column(length = 500)
    private String descricao;

    private Boolean concluida = false;
}
