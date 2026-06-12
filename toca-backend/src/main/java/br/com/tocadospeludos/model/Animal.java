package br.com.tocadospeludos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "animais")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_animal")
    private Long id;

    @NotBlank(message = "O nome do animal é obrigatório")
    @Column(name = "nome_animal", nullable = false, length = 80)
    private String nome;

    @NotNull(message = "A espécie é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(name = "especie", nullable = false, length = 10)
    private Especie especie;

    @Column(name = "raca", length = 60)
    private String raca;

    @Column(name = "dt_nascimento_animal")
    private LocalDate dtNascimento;

    @Column(name = "peso", precision = 5, scale = 2)
    private BigDecimal peso;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_animal", nullable = false, length = 12)
    private StatusAnimal status = StatusAnimal.DISPONIVEL;

    @Column(name = "vacinado")
    private Boolean vacinado = false;

    @Column(name = "castrado")
    private Boolean castrado = false;

    @Column(name = "vermifugado")
    private Boolean vermifugado = false;

    /** URL de foto do animal (opcional). Se vazio, a interface usa um emoji. */
    @Column(name = "foto_url", length = 500)
    private String fotoUrl;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    public Animal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Especie getEspecie() { return especie; }
    public void setEspecie(Especie especie) { this.especie = especie; }
    public String getRaca() { return raca; }
    public void setRaca(String raca) { this.raca = raca; }
    public LocalDate getDtNascimento() { return dtNascimento; }
    public void setDtNascimento(LocalDate dtNascimento) { this.dtNascimento = dtNascimento; }
    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }
    public StatusAnimal getStatus() { return status; }
    public void setStatus(StatusAnimal status) { this.status = status; }
    public Boolean getVacinado() { return vacinado; }
    public void setVacinado(Boolean vacinado) { this.vacinado = vacinado; }
    public Boolean getCastrado() { return castrado; }
    public void setCastrado(Boolean castrado) { this.castrado = castrado; }
    public Boolean getVermifugado() { return vermifugado; }
    public void setVermifugado(Boolean vermifugado) { this.vermifugado = vermifugado; }
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
