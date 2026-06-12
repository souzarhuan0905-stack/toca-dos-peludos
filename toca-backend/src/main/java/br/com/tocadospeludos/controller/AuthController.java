package br.com.tocadospeludos.controller;

import br.com.tocadospeludos.dto.LoginDTO;
import br.com.tocadospeludos.dto.TokenDTO;
import br.com.tocadospeludos.model.Funcionario;
import br.com.tocadospeludos.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO dados) {
        return ResponseEntity.ok(authService.login(dados));
    }

    /** Com JWT o logout acontece no cliente (descarte do token). */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("mensagem", "Sessão encerrada com sucesso."));
    }

    @GetMapping("/me")
    public ResponseEntity<Funcionario> me(Authentication autenticacao) {
        String email = (String) autenticacao.getPrincipal();
        return ResponseEntity.ok(authService.buscarPorEmail(email));
    }
}
