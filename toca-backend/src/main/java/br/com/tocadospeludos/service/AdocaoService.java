package br.com.tocadospeludos.service;

import br.com.tocadospeludos.dto.AdocaoRequestDTO;
import br.com.tocadospeludos.exception.RecursoNaoEncontradoException;
import br.com.tocadospeludos.exception.RegraNegocioException;
import br.com.tocadospeludos.model.*;
import br.com.tocadospeludos.repository.AdocaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdocaoService {

    private final AdocaoRepository adocaoRepository;
    private final CandidatoService candidatoService;
    private final AnimalService animalService;
    private final FuncionarioService funcionarioService;
    private final AtividadeService atividadeService;

    public AdocaoService(AdocaoRepository adocaoRepository,
                         CandidatoService candidatoService,
                         AnimalService animalService,
                         FuncionarioService funcionarioService,
                         AtividadeService atividadeService) {
        this.adocaoRepository = adocaoRepository;
        this.candidatoService = candidatoService;
        this.animalService = animalService;
        this.funcionarioService = funcionarioService;
        this.atividadeService = atividadeService;
    }

    public List<Adocao> listar() {
        return adocaoRepository.findAll();
    }

    public Adocao buscar(Long id) {
        return adocaoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Adoção não encontrada."));
    }

    @Transactional
    public Adocao registrar(AdocaoRequestDTO dados) {
        Candidato candidato = candidatoService.buscar(dados.idCandidato());
        Animal animal = animalService.buscar(dados.idAnimal());

        // Regra de negocio 8: animal ADOTADO nao entra em nova adocao
        if (animal.getStatus() == StatusAnimal.ADOTADO) {
            throw new RegraNegocioException("Este animal já foi adotado e não pode ser vinculado a uma nova adoção.");
        }

        Adocao adocao = new Adocao();
        adocao.setCandidato(candidato);
        adocao.setAnimal(animal);
        if (dados.idFuncionario() != null) {
            adocao.setFuncionario(funcionarioService.buscar(dados.idFuncionario()));
        }
        adocao.setStatus(StatusAdocao.EM_ANDAMENTO);

        // Regra de negocio 10: ao iniciar a adocao, o animal entra EM_PROCESSO
        animal.setStatus(StatusAnimal.EM_PROCESSO);

        Adocao salva = adocaoRepository.save(adocao);
        atividadeService.registrar("ADOCAO_REGISTRADA",
                "Adoção de " + animal.getNome() + " registrada para " + candidato.getNome());
        return salva;
    }

    @Transactional
    public Adocao atualizar(Long id, AdocaoRequestDTO dados) {
        Adocao adocao = buscar(id);
        if (dados.idFuncionario() != null) {
            adocao.setFuncionario(funcionarioService.buscar(dados.idFuncionario()));
        }
        return adocaoRepository.save(adocao);
    }

    @Transactional
    public Adocao alterarStatus(Long id, String novoStatus) {
        Adocao adocao = buscar(id);
        StatusAdocao status;
        try {
            status = StatusAdocao.valueOf(novoStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RegraNegocioException("Status inválido. Use EM_ANDAMENTO, CONCLUIDA ou CANCELADA.");
        }

        adocao.setStatus(status);
        Animal animal = adocao.getAnimal();

        if (status == StatusAdocao.CONCLUIDA) {
            // Regra de negocio 9: ao concluir a adocao, o animal vira ADOTADO
            animal.setStatus(StatusAnimal.ADOTADO);
            atividadeService.registrar("ADOCAO_CONCLUIDA",
                    "Adoção de " + animal.getNome() + " aprovada");
        } else if (status == StatusAdocao.CANCELADA) {
            // O animal volta a ficar disponivel
            animal.setStatus(StatusAnimal.DISPONIVEL);
            atividadeService.registrar("ADOCAO_CANCELADA",
                    "Adoção de " + animal.getNome() + " cancelada");
        }
        return adocaoRepository.save(adocao);
    }
}
