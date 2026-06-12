package br.com.tocadospeludos.controller;

import br.com.tocadospeludos.dto.StatusDTO;
import br.com.tocadospeludos.model.Animal;
import br.com.tocadospeludos.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animais")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @PostMapping
    public ResponseEntity<Animal> criar(@Valid @RequestBody Animal animal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(animalService.criar(animal));
    }

    @GetMapping
    public ResponseEntity<List<Animal>> listar() {
        return ResponseEntity.ok(animalService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.buscar(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Animal> atualizar(@PathVariable Long id, @Valid @RequestBody Animal animal) {
        return ResponseEntity.ok(animalService.atualizar(id, animal));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Animal> alterarStatus(@PathVariable Long id, @Valid @RequestBody StatusDTO dados) {
        return ResponseEntity.ok(animalService.alterarStatus(id, dados.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        animalService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
