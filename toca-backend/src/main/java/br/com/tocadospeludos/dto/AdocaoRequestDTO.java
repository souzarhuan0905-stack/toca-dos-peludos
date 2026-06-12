package br.com.tocadospeludos.dto;

import jakarta.validation.constraints.NotNull;

public record AdocaoRequestDTO(
        @NotNull(message = "Informe o candidato") Long idCandidato,
        @NotNull(message = "Informe o animal") Long idAnimal,
        Long idFuncionario) {
}
