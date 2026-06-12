package br.com.tocadospeludos.controller;

import br.com.tocadospeludos.dto.AdocaoRequestDTO;
import br.com.tocadospeludos.dto.StatusDTO;
import br.com.tocadospeludos.model.Adocao;
import br.com.tocadospeludos.service.AdocaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adocoes")
public class AdocaoController {

    private final AdocaoService adocaoService;

    public AdocaoController(AdocaoService adocaoService) {
        this.adocaoService = adocaoService;
    }

    @PostMapping
    public ResponseEntity<Adocao> registrar(@Valid @RequestBody AdocaoRequestDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adocaoService.registrar(dados));
    }

    @GetMapping
    public ResponseEntity<List<Adocao>> listar() {
        return ResponseEntity.ok(adocaoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adocao> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(adocaoService.buscar(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adocao> atualizar(@PathVariable Long id, @Valid @RequestBody AdocaoRequestDTO dados) {
        return ResponseEntity.ok(adocaoService.atualizar(id, dados));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Adocao> alterarStatus(@PathVariable Long id, @Valid @RequestBody StatusDTO dados) {
        return ResponseEntity.ok(adocaoService.alterarStatus(id, dados.status()));
    }
}
