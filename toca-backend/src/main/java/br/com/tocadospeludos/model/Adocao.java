package br.com.tocadospeludos.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "adocoes")
public class Adocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_adocao")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_candidato", nullable = false)
    private Candidato candidato;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "id_funcionario")
    private Funcionario funcionario;

    @Column(name = "data_adocao")
    private LocalDate dataAdocao = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status_adocao", nullable = false, length = 12)
    private StatusAdocao status = StatusAdocao.EM_ANDAMENTO;

    public Adocao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Candidato getCandidato() { return candidato; }
    public void setCandidato(Candidato candidato) { this.candidato = candidato; }
    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }
    public LocalDate getDataAdocao() { return dataAdocao; }
    public void setDataAdocao(LocalDate dataAdocao) { this.dataAdocao = dataAdocao; }
    public StatusAdocao getStatus() { return status; }
    public void setStatus(StatusAdocao status) { this.status = status; }
}
