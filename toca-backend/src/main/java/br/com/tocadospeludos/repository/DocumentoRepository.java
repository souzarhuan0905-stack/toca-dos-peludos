package br.com.tocadospeludos.repository;

import br.com.tocadospeludos.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByIdCandidato(Long idCandidato);
}
