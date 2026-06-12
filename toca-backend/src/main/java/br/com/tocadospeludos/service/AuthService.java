package br.com.tocadospeludos.service;

import br.com.tocadospeludos.dto.LoginDTO;
import br.com.tocadospeludos.dto.TokenDTO;
import br.com.tocadospeludos.exception.CredenciaisInvalidasException;
import br.com.tocadospeludos.model.Funcionario;
import br.com.tocadospeludos.repository.FuncionarioRepository;
import br.com.tocadospeludos.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(FuncionarioRepository funcionarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public TokenDTO login(LoginDTO dados) {
        Funcionario funcionario = funcionarioRepository.findByEmail(dados.email())
                .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(dados.senha(), funcionario.getSenhaHash())) {
            throw new CredenciaisInvalidasException("E-mail ou senha inválidos.");
        }

        String token = jwtService.gerarToken(funcionario);
        return new TokenDTO(token, funcionario.getId(), funcionario.getNome(),
                funcionario.getEmail(), funcionario.getPerfil().name());
    }

    public Funcionario buscarPorEmail(String email) {
        return funcionarioRepository.findByEmail(email)
                .orElseThrow(() -> new CredenciaisInvalidasException("Sessão inválida."));
    }
}
