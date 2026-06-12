package br.com.tocadospeludos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Long id;

    @Column(name = "id_candidato", nullable = false)
    private Long idCandidato;

    @Column(name = "tipo_documento", nullable = false, length = 40)
    private String tipoDocumento;

    @Column(name = "nome_original", nullable = false, length = 255)
    private String nomeOriginal;

    @Column(name = "nome_arquivo_salvo", nullable = false, length = 255)
    private String nomeArquivoSalvo;

    @Column(name = "caminho_arquivo", nullable = false, length = 500)
    private String caminhoArquivo;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @Column(name = "data_upload")
    private LocalDateTime dataUpload = LocalDateTime.now();

    public Documento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getIdCandidato() { return idCandidato; }
    public void setIdCandidato(Long idCandidato) { this.idCandidato = idCandidato; }
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getNomeOriginal() { return nomeOriginal; }
    public void setNomeOriginal(String nomeOriginal) { this.nomeOriginal = nomeOriginal; }
    public String getNomeArquivoSalvo() { return nomeArquivoSalvo; }
    public void setNomeArquivoSalvo(String nomeArquivoSalvo) { this.nomeArquivoSalvo = nomeArquivoSalvo; }
    public String getCaminhoArquivo() { return caminhoArquivo; }
    public void setCaminhoArquivo(String caminhoArquivo) { this.caminhoArquivo = caminhoArquivo; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    public Long getTamanhoBytes() { return tamanhoBytes; }
    public void setTamanhoBytes(Long tamanhoBytes) { this.tamanhoBytes = tamanhoBytes; }
    public LocalDateTime getDataUpload() { return dataUpload; }
    public void setDataUpload(LocalDateTime dataUpload) { this.dataUpload = dataUpload; }
}
