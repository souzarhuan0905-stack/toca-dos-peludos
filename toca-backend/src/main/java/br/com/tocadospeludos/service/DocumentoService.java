package br.com.tocadospeludos.service;

import br.com.tocadospeludos.exception.RecursoNaoEncontradoException;
import br.com.tocadospeludos.exception.RegraNegocioException;
import br.com.tocadospeludos.model.Documento;
import br.com.tocadospeludos.repository.CandidatoRepository;
import br.com.tocadospeludos.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/** Upload controlado de arquivos (regras de negocio 6 e 7). */
@Service
public class DocumentoService {

    private static final Set<String> EXTENSOES_PERMITIDAS = Set.of("pdf", "jpg", "jpeg", "png");
    private static final long TAMANHO_MAXIMO_BYTES = 5L * 1024 * 1024; // 5 MB

    private final DocumentoRepository documentoRepository;
    private final CandidatoRepository candidatoRepository;

    @Value("${app.upload.dir}")
    private String diretorioUpload;

    public DocumentoService(DocumentoRepository documentoRepository,
                            CandidatoRepository candidatoRepository) {
        this.documentoRepository = documentoRepository;
        this.candidatoRepository = candidatoRepository;
    }

    @Transactional
    public Documento salvar(Long idCandidato, String tipoDocumento, MultipartFile arquivo) {
        if (!candidatoRepository.existsById(idCandidato)) {
            throw new RecursoNaoEncontradoException("Candidato não encontrado.");
        }
        if (arquivo == null || arquivo.isEmpty()) {
            throw new RegraNegocioException("Nenhum arquivo foi enviado.");
        }

        String nomeOriginal = arquivo.getOriginalFilename() == null ? "arquivo" : arquivo.getOriginalFilename();
        String extensao = extrairExtensao(nomeOriginal);

        // Regra de negocio 6: extensao permitida (PDF, JPG, PNG)
        if (!EXTENSOES_PERMITIDAS.contains(extensao)) {
            throw new RegraNegocioException("Extensão não permitida. Envie arquivos PDF, JPG ou PNG.");
        }
        // Regra de negocio 7: tamanho maximo por arquivo
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new RegraNegocioException("O arquivo excede o tamanho máximo permitido de 5 MB.");
        }

        try {
            Path pasta = Path.of(diretorioUpload).toAbsolutePath();
            Files.createDirectories(pasta);

            String nomeSalvo = UUID.randomUUID() + "." + extensao;
            Path destino = pasta.resolve(nomeSalvo);
            arquivo.transferTo(destino.toFile());

            Documento documento = new Documento();
            documento.setIdCandidato(idCandidato);
            documento.setTipoDocumento(tipoDocumento == null ? "OUTRO" : tipoDocumento);
            documento.setNomeOriginal(nomeOriginal);
            documento.setNomeArquivoSalvo(nomeSalvo);
            documento.setCaminhoArquivo(destino.toString());
            documento.setMimeType(arquivo.getContentType());
            documento.setTamanhoBytes(arquivo.getSize());
            return documentoRepository.save(documento);
        } catch (IOException e) {
            throw new RegraNegocioException("Não foi possível salvar o arquivo no servidor.");
        }
    }

    public List<Documento> listarDoCandidato(Long idCandidato) {
        return documentoRepository.findByIdCandidato(idCandidato);
    }

    public Documento buscar(Long id) {
        return documentoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Documento não encontrado."));
    }

    public Resource carregarArquivo(Documento documento) {
        try {
            Resource resource = new UrlResource(Path.of(documento.getCaminhoArquivo()).toUri());
            if (!resource.exists()) {
                throw new RecursoNaoEncontradoException("Arquivo não encontrado no servidor.");
            }
            return resource;
        } catch (java.net.MalformedURLException e) {
            throw new RecursoNaoEncontradoException("Arquivo não encontrado no servidor.");
        }
    }

    @Transactional
    public void excluir(Long id) {
        Documento documento = buscar(id);
        try {
            Files.deleteIfExists(Path.of(documento.getCaminhoArquivo()));
        } catch (IOException ignored) {
            // O registro e removido mesmo que o arquivo fisico ja nao exista
        }
        documentoRepository.delete(documento);
    }

    private String extrairExtensao(String nomeArquivo) {
        int ponto = nomeArquivo.lastIndexOf('.');
        if (ponto < 0) return "";
        return nomeArquivo.substring(ponto + 1).toLowerCase();
    }
}
