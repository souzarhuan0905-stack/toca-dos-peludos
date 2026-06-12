package br.com.tocadospeludos.service;

import br.com.tocadospeludos.exception.RecursoNaoEncontradoException;
import br.com.tocadospeludos.exception.RegraNegocioException;
import br.com.tocadospeludos.model.Animal;
import br.com.tocadospeludos.model.StatusAnimal;
import br.com.tocadospeludos.repository.AnimalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AtividadeService atividadeService;

    public AnimalService(AnimalRepository animalRepository, AtividadeService atividadeService) {
        this.animalRepository = animalRepository;
        this.atividadeService = atividadeService;
    }

    public List<Animal> listar() {
        return animalRepository.findAll();
    }

    public Animal buscar(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Animal não encontrado."));
    }

    @Transactional
    public Animal criar(Animal animal) {
        animal.setId(null);
        if (animal.getStatus() == null) {
            animal.setStatus(StatusAnimal.DISPONIVEL);
        }
        Animal salvo = animalRepository.save(animal);
        atividadeService.registrar("ANIMAL_CADASTRADO", "Animal " + salvo.getNome() + " cadastrado");
        return salvo;
    }

    @Transactional
    public Animal atualizar(Long id, Animal dados) {
        Animal animal = buscar(id);
        animal.setNome(dados.getNome());
        animal.setEspecie(dados.getEspecie());
        animal.setRaca(dados.getRaca());
        animal.setDtNascimento(dados.getDtNascimento());
        animal.setPeso(dados.getPeso());
        animal.setVacinado(dados.getVacinado());
        animal.setCastrado(dados.getCastrado());
        animal.setVermifugado(dados.getVermifugado());
        animal.setObservacoes(dados.getObservacoes());
        if (dados.getStatus() != null) {
            animal.setStatus(dados.getStatus());
        }
        return animalRepository.save(animal);
    }

    @Transactional
    public Animal alterarStatus(Long id, String novoStatus) {
        Animal animal = buscar(id);
        try {
            animal.setStatus(StatusAnimal.valueOf(novoStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RegraNegocioException("Status inválido. Use DISPONIVEL, EM_PROCESSO ou ADOTADO.");
        }
        return animalRepository.save(animal);
    }

    @Transactional
    public void excluir(Long id) {
        animalRepository.delete(buscar(id));
    }
}
