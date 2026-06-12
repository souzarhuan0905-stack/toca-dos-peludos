package br.com.tocadospeludos.controller;

import br.com.tocadospeludos.model.Documento;
import br.com.tocadospeludos.service.DocumentoService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    /** Endpoint publico: usado na etapa 3 do formulario "Quero Adotar". */
    @PostMapping("/candidatos/{id}/documentos")
    public ResponseEntity<Documento> enviar(@PathVariable Long id,
                                            @RequestParam("tipoDocumento") String tipoDocumento,
                                            @RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentoService.salvar(id, tipoDocumento, arquivo));
    }

    @GetMapping("/candidatos/{id}/documentos")
    public ResponseEntity<List<Documento>> listar(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.listarDoCandidato(id));
    }

    @GetMapping("/documentos/{id}/download")
    public ResponseEntity<Resource> baixar(@PathVariable Long id) {
        Documento documento = documentoService.buscar(id);
        Resource arquivo = documentoService.carregarArquivo(documento);
        String mime = documento.getMimeType() == null ? "application/octet-stream" : documento.getMimeType();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mime))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + documento.getNomeOriginal() + "\"")
                .body(arquivo);
    }

    @DeleteMapping("/documentos/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        documentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
