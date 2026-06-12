package br.com.tocadospeludos.controller;

import br.com.tocadospeludos.dto.StatusDTO;
import br.com.tocadospeludos.model.Candidato;
import br.com.tocadospeludos.service.CandidatoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    private final CandidatoService candidatoService;

    public CandidatoController(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    /** Endpoint publico: usado pelo formulario "Quero Adotar". */
    @PostMapping
    public ResponseEntity<Candidato> criar(@Valid @RequestBody Candidato candidato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidatoService.criar(candidato));
    }

    @GetMapping
    public ResponseEntity<List<Candidato>> listar() {
        return ResponseEntity.ok(candidatoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidato> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(candidatoService.buscar(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidato> atualizar(@PathVariable Long id, @Valid @RequestBody Candidato candidato) {
        return ResponseEntity.ok(candidatoService.atualizar(id, candidato));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Candidato> alterarStatus(@PathVariable Long id, @Valid @RequestBody StatusDTO dados) {
        return ResponseEntity.ok(candidatoService.alterarStatus(id, dados.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        candidatoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
