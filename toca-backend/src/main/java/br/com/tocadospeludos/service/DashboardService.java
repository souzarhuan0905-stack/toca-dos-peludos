package br.com.tocadospeludos.service;

import br.com.tocadospeludos.dto.DashboardResumoDTO;
import br.com.tocadospeludos.model.StatusAdocao;
import br.com.tocadospeludos.model.StatusAnimal;
import br.com.tocadospeludos.model.StatusCandidato;
import br.com.tocadospeludos.repository.AdocaoRepository;
import br.com.tocadospeludos.repository.AnimalRepository;
import br.com.tocadospeludos.repository.CandidatoRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final CandidatoRepository candidatoRepository;
    private final AnimalRepository animalRepository;
    private final AdocaoRepository adocaoRepository;
    private final AtividadeService atividadeService;

    public DashboardService(CandidatoRepository candidatoRepository,
                            AnimalRepository animalRepository,
                            AdocaoRepository adocaoRepository,
                            AtividadeService atividadeService) {
        this.candidatoRepository = candidatoRepository;
        this.animalRepository = animalRepository;
        this.adocaoRepository = adocaoRepository;
        this.atividadeService = atividadeService;
    }

    public DashboardResumoDTO resumo() {
        return new DashboardResumoDTO(
                candidatoRepository.count(),
                candidatoRepository.countByStatus(StatusCandidato.PENDENTE),
                candidatoRepository.countByStatus(StatusCandidato.APROVADO),
                candidatoRepository.countByStatus(StatusCandidato.REJEITADO),
                animalRepository.countByStatus(StatusAnimal.DISPONIVEL),
                adocaoRepository.countByStatus(StatusAdocao.CONCLUIDA),
                candidatoRepository.findTop5ByOrderByDataCadastroDesc(),
                atividadeService.recentes());
    }
}
