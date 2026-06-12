package br.com.tocadospeludos.exception;

/** Login invalido (HTTP 401). */
public class CredenciaisInvalidasException extends RuntimeException {
    public CredenciaisInvalidasException(String mensagem) {
        super(mensagem);
    }
}
