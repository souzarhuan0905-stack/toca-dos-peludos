package br.com.tocadospeludos.service;

import br.com.tocadospeludos.exception.RecursoNaoEncontradoException;
import br.com.tocadospeludos.exception.RegraNegocioException;
import br.com.tocadospeludos.model.Funcionario;
import br.com.tocadospeludos.repository.FuncionarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;

    public FuncionarioService(FuncionarioRepository funcionarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Funcionario> listar() {
        return funcionarioRepository.findAll();
    }

    public Funcionario buscar(Long id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado."));
    }

    @Transactional
    public Funcionario criar(Funcionario funcionario) {
        // Regra de negocio 3: e-mail de funcionario deve ser unico
        if (funcionarioRepository.existsByEmail(funcionario.getEmail())) {
            throw new RegraNegocioException("O e-mail informado já está cadastrado.");
        }
        if (funcionarioRepository.existsByCpf(funcionario.getCpf())) {
            throw new RegraNegocioException("O CPF informado já está cadastrado.");
        }
        if (funcionario.getSenha() == null || funcionario.getSenha().isBlank()) {
            throw new RegraNegocioException("Informe uma senha para o funcionário.");
        }
        funcionario.setId(null);
        funcionario.setSenhaHash(passwordEncoder.encode(funcionario.getSenha()));
        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public Funcionario atualizar(Long id, Funcionario dados) {
        Funcionario funcionario = buscar(id);

        if (!funcionario.getEmail().equals(dados.getEmail())
                && funcionarioRepository.existsByEmail(dados.getEmail())) {
            throw new RegraNegocioException("O e-mail informado já está cadastrado.");
        }

        funcionario.setNome(dados.getNome());
        funcionario.setCpf(dados.getCpf());
        funcionario.setDtNascimento(dados.getDtNascimento());
        funcionario.setEmail(dados.getEmail());
        funcionario.setPerfil(dados.getPerfil());
        // A senha so e trocada se uma nova for informada
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            funcionario.setSenhaHash(passwordEncoder.encode(dados.getSenha()));
        }
        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public void excluir(Long id) {
        funcionarioRepository.delete(buscar(id));
    }
}
