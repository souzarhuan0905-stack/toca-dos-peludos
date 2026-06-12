package br.com.tocadospeludos.exception;

import java.time.LocalDateTime;

/** Formato JSON padronizado para respostas de erro da API. */
public record ErroResposta(LocalDateTime timestamp, int status, String erro, String mensagem) {

    public static ErroResposta de(int status, String erro, String mensagem) {
        return new ErroResposta(LocalDateTime.now(), status, erro, mensagem);
    }
}
