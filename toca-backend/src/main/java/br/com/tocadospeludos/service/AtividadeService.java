package br.com.tocadospeludos.service;

import br.com.tocadospeludos.model.Atividade;
import br.com.tocadospeludos.repository.AtividadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;

    public AtividadeService(AtividadeRepository atividadeRepository) {
        this.atividadeRepository = atividadeRepository;
    }

    public void registrar(String tipo, String descricao) {
        atividadeRepository.save(new Atividade(tipo, descricao));
    }

    public List<Atividade> recentes() {
        return atividadeRepository.findTop10ByOrderByDataAtividadeDesc();
    }
}
