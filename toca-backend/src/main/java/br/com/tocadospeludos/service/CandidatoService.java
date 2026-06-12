package br.com.tocadospeludos.service;

import br.com.tocadospeludos.exception.RecursoNaoEncontradoException;
import br.com.tocadospeludos.exception.RegraNegocioException;
import br.com.tocadospeludos.model.Candidato;
import br.com.tocadospeludos.model.StatusCandidato;
import br.com.tocadospeludos.repository.CandidatoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final AtividadeService atividadeService;

    public CandidatoService(CandidatoRepository candidatoRepository, AtividadeService atividadeService) {
        this.candidatoRepository = candidatoRepository;
        this.atividadeService = atividadeService;
    }

    public List<Candidato> listar() {
        return candidatoRepository.findAll();
    }

    public Candidato buscar(Long id) {
        return candidatoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Candidato não encontrado."));
    }

    @Transactional
    public Candidato criar(Candidato candidato) {
        // Regra de negocio 2: CPF de candidato deve ser unico
        if (candidatoRepository.existsByCpf(candidato.getCpf())) {
            throw new RegraNegocioException("O CPF informado já está cadastrado.");
        }
        // Regra de negocio 1: todo candidato novo inicia PENDENTE
        candidato.setId(null);
        candidato.setStatus(StatusCandidato.PENDENTE);

        Candidato salvo = candidatoRepository.save(candidato);
        atividadeService.registrar("CANDIDATO_CADASTRADO",
                "Candidato " + salvo.getNome() + " cadastrado");
        return salvo;
    }

    @Transactional
    public Candidato atualizar(Long id, Candidato dados) {
        Candidato candidato = buscar(id);

        if (!candidato.getCpf().equals(dados.getCpf()) && candidatoRepository.existsByCpf(dados.getCpf())) {
            throw new RegraNegocioException("O CPF informado já está cadastrado.");
        }

        candidato.setNome(dados.getNome());
        candidato.setCpf(dados.getCpf());
        candidato.setDtNascimento(dados.getDtNascimento());
        candidato.setEmail(dados.getEmail());
        candidato.setTelefone(dados.getTelefone());
        candidato.setEndereco(dados.getEndereco());
        candidato.setTipoMoradia(dados.getTipoMoradia());
        candidato.setPossuiQuintal(dados.getPossuiQuintal());
        candidato.setPossuiEspacoExterno(dados.getPossuiEspacoExterno());
        candidato.setTemOutrosAnimais(dados.getTemOutrosAnimais());
        candidato.setCriancasEmCasa(dados.getCriancasEmCasa());
        candidato.setHorasEmCasaPorDia(dados.getHorasEmCasaPorDia());
        candidato.setTemCercaOuTela(dados.getTemCercaOuTela());
        candidato.setDescricaoAmbiente(dados.getDescricaoAmbiente());
        return candidatoRepository.save(candidato);
    }

    /** Regra de negocio 11: aprovar, rejeitar ou voltar para pendente. */
    @Transactional
    public Candidato alterarStatus(Long id, String novoStatus) {
        Candidato candidato = buscar(id);
        StatusCandidato status;
        try {
            status = StatusCandidato.valueOf(novoStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RegraNegocioException("Status inválido. Use PENDENTE, APROVADO ou REJEITADO.");
        }
        candidato.setStatus(status);
        Candidato salvo = candidatoRepository.save(candidato);

        if (status == StatusCandidato.APROVADO) {
            atividadeService.registrar("CANDIDATO_APROVADO",
                    "Candidatura de " + salvo.getNome() + " aprovada");
        } else if (status == StatusCandidato.REJEITADO) {
            atividadeService.registrar("CANDIDATO_REJEITADO",
                    "Candidatura de " + salvo.getNome() + " rejeitada");
        }
        return salvo;
    }

    @Transactional
    public void excluir(Long id) {
        Candidato candidato = buscar(id);
        candidatoRepository.delete(candidato);
    }
}
