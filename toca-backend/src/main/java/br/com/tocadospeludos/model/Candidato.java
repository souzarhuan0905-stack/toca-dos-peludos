package br.com.tocadospeludos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidatos")
public class Candidato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_candidato")
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome_candidato", nullable = false, length = 120)
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    @Column(name = "cpf_candidato", nullable = false, unique = true, length = 11)
    private String cpf;

    @NotNull(message = "A data de nascimento é obrigatória")
    @Column(name = "dt_nascimento_candidato", nullable = false)
    private LocalDate dtNascimento;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Column(name = "email_candidato", nullable = false, length = 120)
    private String email;

    @Column(name = "telefone_candidato", length = 13)
    private String telefone;

    @Column(name = "endereco_candidato", length = 255)
    private String endereco;

    @Column(name = "tipo_moradia", length = 30)
    private String tipoMoradia;

    @Column(name = "possui_quintal")
    private Boolean possuiQuintal = false;

    @Column(name = "possui_espaco_externo")
    private Boolean possuiEspacoExterno = false;

    @Column(name = "tem_outros_animais")
    private Boolean temOutrosAnimais = false;

    @Column(name = "criancas_em_casa")
    private Boolean criancasEmCasa = false;

    @Column(name = "horas_em_casa_por_dia", length = 20)
    private String horasEmCasaPorDia;

    @Column(name = "tem_cerca_ou_tela")
    private Boolean temCercaOuTela = false;

    @Column(name = "descricao_ambiente", columnDefinition = "TEXT")
    private String descricaoAmbiente;

    /** Animal de interesse escolhido pelo candidato no formulário público. */
    @Column(name = "id_animal_desejado")
    private Long idAnimalDesejado;

    @Column(name = "nome_animal_desejado", length = 80)
    private String nomeAnimalDesejado;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_candidato", nullable = false, length = 10)
    private StatusCandidato status = StatusCandidato.PENDENTE;

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro = LocalDateTime.now();

    public Candidato() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public LocalDate getDtNascimento() { return dtNascimento; }
    public void setDtNascimento(LocalDate dtNascimento) { this.dtNascimento = dtNascimento; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getTipoMoradia() { return tipoMoradia; }
    public void setTipoMoradia(String tipoMoradia) { this.tipoMoradia = tipoMoradia; }
    public Boolean getPossuiQuintal() { return possuiQuintal; }
    public void setPossuiQuintal(Boolean possuiQuintal) { this.possuiQuintal = possuiQuintal; }
    public Boolean getPossuiEspacoExterno() { return possuiEspacoExterno; }
    public void setPossuiEspacoExterno(Boolean possuiEspacoExterno) { this.possuiEspacoExterno = possuiEspacoExterno; }
    public Boolean getTemOutrosAnimais() { return temOutrosAnimais; }
    public void setTemOutrosAnimais(Boolean temOutrosAnimais) { this.temOutrosAnimais = temOutrosAnimais; }
    public Boolean getCriancasEmCasa() { return criancasEmCasa; }
    public void setCriancasEmCasa(Boolean criancasEmCasa) { this.criancasEmCasa = criancasEmCasa; }
    public String getHorasEmCasaPorDia() { return horasEmCasaPorDia; }
    public void setHorasEmCasaPorDia(String horasEmCasaPorDia) { this.horasEmCasaPorDia = horasEmCasaPorDia; }
    public Boolean getTemCercaOuTela() { return temCercaOuTela; }
    public void setTemCercaOuTela(Boolean temCercaOuTela) { this.temCercaOuTela = temCercaOuTela; }
    public String getDescricaoAmbiente() { return descricaoAmbiente; }
    public void setDescricaoAmbiente(String descricaoAmbiente) { this.descricaoAmbiente = descricaoAmbiente; }
    public Long getIdAnimalDesejado() { return idAnimalDesejado; }
    public void setIdAnimalDesejado(Long idAnimalDesejado) { this.idAnimalDesejado = idAnimalDesejado; }
    public String getNomeAnimalDesejado() { return nomeAnimalDesejado; }
    public void setNomeAnimalDesejado(String nomeAnimalDesejado) { this.nomeAnimalDesejado = nomeAnimalDesejado; }
    public StatusCandidato getStatus() { return status; }
    public void setStatus(StatusCandidato status) { this.status = status; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
}
