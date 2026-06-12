package br.com.tocadospeludos.security;

import br.com.tocadospeludos.model.Funcionario;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Geracao e validacao de tokens JWT (HS256) sem bibliotecas externas,
 * usando apenas a criptografia padrao do Java. Suficiente para o MVP.
 */
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String segredo;

    @Value("${app.jwt.expiracao-minutos}")
    private long expiracaoMinutos;

    private final ObjectMapper mapper = new ObjectMapper();

    public String gerarToken(Funcionario funcionario) {
        try {
            Map<String, Object> cabecalho = new LinkedHashMap<>();
            cabecalho.put("alg", "HS256");
            cabecalho.put("typ", "JWT");

            Map<String, Object> corpo = new LinkedHashMap<>();
            corpo.put("sub", funcionario.getEmail());
            corpo.put("nome", funcionario.getNome());
            corpo.put("perfil", funcionario.getPerfil().name());
            corpo.put("exp", Instant.now().plusSeconds(expiracaoMinutos * 60).getEpochSecond());

            String parte1 = b64(mapper.writeValueAsBytes(cabecalho));
            String parte2 = b64(mapper.writeValueAsBytes(corpo));
            return parte1 + "." + parte2 + "." + assinar(parte1 + "." + parte2);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao gerar token", e);
        }
    }

    /** Retorna as claims do token ou null se for invalido/expirado. */
    public Map<String, Object> validar(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) return null;

            String assinaturaEsperada = assinar(partes[0] + "." + partes[1]);
            boolean assinaturaOk = MessageDigest.isEqual(
                    assinaturaEsperada.getBytes(StandardCharsets.UTF_8),
                    partes[2].getBytes(StandardCharsets.UTF_8));
            if (!assinaturaOk) return null;

            byte[] json = Base64.getUrlDecoder().decode(partes[1]);
            Map<String, Object> claims = mapper.readValue(json, new TypeReference<Map<String, Object>>() {});

            long exp = ((Number) claims.get("exp")).longValue();
            if (Instant.now().getEpochSecond() > exp) return null;

            return claims;
        } catch (Exception e) {
            return null;
        }
    }

    private String assinar(String dados) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(segredo.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return b64(mac.doFinal(dados.getBytes(StandardCharsets.UTF_8)));
    }

    private String b64(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
