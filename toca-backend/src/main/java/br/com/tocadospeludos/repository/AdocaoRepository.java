package br.com.tocadospeludos.repository;

import br.com.tocadospeludos.model.Adocao;
import br.com.tocadospeludos.model.StatusAdocao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdocaoRepository extends JpaRepository<Adocao, Long> {
    long countByStatus(StatusAdocao status);
}
