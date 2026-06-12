package br.com.tocadospeludos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResposta> regraNegocio(RegraNegocioException e) {
        return ResponseEntity.badRequest()
                .body(ErroResposta.de(400, "Dados inválidos", e.getMessage()));
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> naoEncontrado(RecursoNaoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErroResposta.de(404, "Não encontrado", e.getMessage()));
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ErroResposta> credenciais(CredenciaisInvalidasException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErroResposta.de(401, "Não autorizado", e.getMessage()));
    }

    /** Erros de validacao dos campos obrigatorios (regra de negocio 12). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException e) {
        String mensagem = e.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .findFirst()
                .orElse("Há campos obrigatórios não preenchidos.");
        return ResponseEntity.badRequest()
                .body(ErroResposta.de(400, "Dados inválidos", mensagem));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErroResposta> uploadGrande(MaxUploadSizeExceededException e) {
        return ResponseEntity.badRequest()
                .body(ErroResposta.de(400, "Arquivo muito grande", "O arquivo excede o tamanho máximo permitido de 5 MB."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> geral(Exception e) {
        return ResponseEntity.internalServerError()
                .body(ErroResposta.de(500, "Erro interno", "Ocorreu um erro inesperado no servidor."));
    }
}
