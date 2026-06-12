package br.com.tocadospeludos.dto;

import br.com.tocadospeludos.model.Atividade;
import br.com.tocadospeludos.model.Candidato;

import java.util.List;

/** Resposta unica do GET /api/dashboard/resumo */
public record DashboardResumoDTO(
        long totalCandidatos,
        long candidatosPendentes,
        long candidatosAprovados,
        long candidatosRejeitados,
        long animaisDisponiveis,
        long adocoesConcluidas,
        List<Candidato> ultimosCandidatos,
        List<Atividade> atividadesRecentes) {
}
