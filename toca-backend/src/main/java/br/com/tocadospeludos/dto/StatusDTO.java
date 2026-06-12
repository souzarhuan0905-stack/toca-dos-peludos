package br.com.tocadospeludos.dto;

import jakarta.validation.constraints.NotBlank;

/** Corpo dos endpoints PATCH .../status */
public record StatusDTO(@NotBlank(message = "Informe o status") String status) {
}
