package br.com.tocadospeludos.repository;

import br.com.tocadospeludos.model.Candidato;
import br.com.tocadospeludos.model.StatusCandidato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
    boolean existsByCpf(String cpf);
    long countByStatus(StatusCandidato status);
    List<Candidato> findTop5ByOrderByDataCadastroDesc();
}
