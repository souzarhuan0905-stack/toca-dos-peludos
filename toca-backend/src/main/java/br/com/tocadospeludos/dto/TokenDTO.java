package br.com.tocadospeludos.dto;

/** Resposta do login: token JWT + dados basicos do funcionario logado. */
public record TokenDTO(String token, Long id, String nome, String email, String perfil) {
}
