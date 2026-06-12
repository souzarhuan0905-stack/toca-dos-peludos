package br.com.tocadospeludos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "atividades")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atividade")
    private Long id;

    @Column(name = "tipo_atividade", nullable = false, length = 30)
    private String tipo;

    @Column(name = "descricao", nullable = false, length = 255)
    private String descricao;

    @Column(name = "data_atividade")
    private LocalDateTime dataAtividade = LocalDateTime.now();

    public Atividade() {}

    public Atividade(String tipo, String descricao) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.dataAtividade = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataAtividade() { return dataAtividade; }
    public void setDataAtividade(LocalDateTime dataAtividade) { this.dataAtividade = dataAtividade; }
}
