package br.com.tocadospeludos.config;

import br.com.tocadospeludos.model.*;
import br.com.tocadospeludos.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class CargaInicial implements CommandLineRunner {

    private final FuncionarioRepository funcionarioRepository;
    private final CandidatoRepository candidatoRepository;
    private final AnimalRepository animalRepository;
    private final AdocaoRepository adocaoRepository;
    private final AtividadeRepository atividadeRepository;
    private final PasswordEncoder passwordEncoder;

    public CargaInicial(FuncionarioRepository funcionarioRepository,
                        CandidatoRepository candidatoRepository,
                        AnimalRepository animalRepository,
                        AdocaoRepository adocaoRepository,
                        AtividadeRepository atividadeRepository,
                        PasswordEncoder passwordEncoder) {
        this.funcionarioRepository = funcionarioRepository;
        this.candidatoRepository = candidatoRepository;
        this.animalRepository = animalRepository;
        this.adocaoRepository = adocaoRepository;
        this.atividadeRepository = atividadeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (funcionarioRepository.count() > 0) return;

        // ===== Funcionarios =====
        Funcionario admin  = funcionario("Administrador",                 "00000000000", "admin@tocadospeludos.org",  Perfil.ADMIN,      LocalDate.of(1990, 1,  1));
        Funcionario felipe = funcionario("Felipe Marques Pereira",        "20268202400", "felipe@tocadospeludos.org", Perfil.ADMIN,      LocalDate.of(2000, 6, 15));
        Funcionario luiz   = funcionario("Luiz Gustavo Batista de Sousa", "22937202400", "luiz@tocadospeludos.org",   Perfil.VOLUNTARIO, LocalDate.of(1999, 9, 22));
        Funcionario rhuan  = funcionario("Rhuan Vinicius Camilo de Souza","24121202400", "rhuan@tocadospeludos.org",  Perfil.CUIDADOR,   LocalDate.of(2001, 2, 10));

        // ===== Animais (fotos do Unsplash – uso livre) =====
        // Bolinha – Golden Retriever
        Animal bolinha = animal("Bolinha", Especie.CAO, "Golden Retriever",
                LocalDate.of(2024, 3, 10), "28.50", true, true, true,
                "Brincalhão e dócil com crianças.",
                "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=420&fit=crop");

        // Mel – Gato SRD laranjinha
        Animal mel = animal("Mel", Especie.GATO, "SRD",
                LocalDate.of(2025, 1, 20), "3.80", true, false, true,
                "Dócil, adora colo e ronrona muito.",
                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=420&fit=crop");

        // Pipoca – Poodle
        Animal pipoca = animal("Pipoca", Especie.CAO, "Poodle",
                LocalDate.of(2023, 5, 2), "7.20", true, true, true,
                "Manso e companheiro, ideal para apartamento.",
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=420&fit=crop");

        // Luna – Siamês
        Animal luna = animal("Luna", Especie.GATO, "Siamês",
                LocalDate.of(2022, 8, 14), "4.10", true, true, false,
                "Independente, elegante e muito curiosa.",
                "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&h=420&fit=crop");

        // Thor – Cão SRD filhote
        Animal thor = animal("Thor", Especie.CAO, "SRD",
                LocalDate.of(2024, 11, 5), "15.00", false, false, true,
                "Filhote resgatado, cheio de energia e amor.",
                "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&h=420&fit=crop");

        // Nina – Gato SRD filhote
        Animal nina = animal("Nina", Especie.GATO, "SRD",
                LocalDate.of(2025, 4, 1), "2.90", true, false, false,
                "Tímida no início, mas extremamente carinhosa.",
                "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&h=420&fit=crop");

        // ===== Candidatos =====
        Candidato ana = candidato("Ana Paula Souza","12345678900",
                LocalDate.of(1990,3,12),"ana.paula@email.com","11987654321",
                "Rua das Flores, 123 - Guarulhos/SP","CASA",true,true,false,true,
                "8h ou mais",true,"Quintal grande e cercado.",StatusCandidato.PENDENTE,
                mel.getId(), mel.getNome());
        Candidato carlos = candidato("Carlos Mendes","98765432100",
                LocalDate.of(1985,7,5),"carlos.m@email.com","11912345678",
                "Av. Paulista, 1000 - São Paulo/SP","APARTAMENTO",false,false,true,false,
                "4h a 8h",true,"Apartamento com telas em todas as janelas.",StatusCandidato.APROVADO,
                bolinha.getId(), bolinha.getNome());
        Candidato fernanda = candidato("Fernanda Lima","45612378900",
                LocalDate.of(1993,11,20),"fer.lima@email.com","21998765432",
                "Rua do Sol, 45 - Rio de Janeiro/RJ","APARTAMENTO",false,false,false,false,
                "Menos de 4h",false,"Trabalho fora o dia inteiro.",StatusCandidato.REJEITADO,
                thor.getId(), thor.getNome());
        Candidato ricardo = candidato("Ricardo Alves","32165498700",
                LocalDate.of(1978,8,14),"ricardo.a@email.com","31976543210",
                "Rua das Acácias, 78 - Belo Horizonte/MG","CHACARA",true,true,true,true,
                "8h ou mais",true,"Chácara com muito espaço.",StatusCandidato.PENDENTE,
                thor.getId(), thor.getNome());
        Candidato juliana = candidato("Juliana Torres","65432198700",
                LocalDate.of(1995,1,30),"ju.torres@email.com","11954321098",
                "Rua Verde, 250 - Guarulhos/SP","CASA",true,false,false,true,
                "4h a 8h",true,"Casa com quintal murado.",StatusCandidato.APROVADO,
                luna.getId(), luna.getNome());

        // ===== Adoções =====
        adocao(carlos, bolinha, felipe, LocalDate.now().minusDays(15), StatusAdocao.CONCLUIDA);
        bolinha.setStatus(StatusAnimal.ADOTADO);
        animalRepository.save(bolinha);

        adocao(juliana, luna, luiz, LocalDate.now().minusDays(17), StatusAdocao.CONCLUIDA);
        luna.setStatus(StatusAnimal.ADOTADO);
        animalRepository.save(luna);

        adocao(ana, mel, null, LocalDate.now().minusDays(2), StatusAdocao.EM_ANDAMENTO);
        mel.setStatus(StatusAnimal.EM_PROCESSO);
        animalRepository.save(mel);

        // ===== Atividades =====
        atividadeRepository.save(new Atividade("CANDIDATO_CADASTRADO", "Candidato Ana Paula Souza cadastrado"));
        atividadeRepository.save(new Atividade("ADOCAO_CONCLUIDA",     "Adoção de Bolinha aprovada"));
        atividadeRepository.save(new Atividade("ANIMAL_CADASTRADO",    "Animal Mel cadastrado"));
        atividadeRepository.save(new Atividade("CANDIDATO_REJEITADO",  "Candidatura de Fernanda Lima rejeitada"));
        atividadeRepository.save(new Atividade("ADOCAO_CONCLUIDA",     "Adoção de Luna aprovada"));
    }

    private Funcionario funcionario(String nome, String cpf, String email, Perfil perfil, LocalDate nasc) {
        Funcionario f = new Funcionario();
        f.setNome(nome); f.setCpf(cpf); f.setEmail(email);
        f.setPerfil(perfil); f.setDtNascimento(nasc);
        f.setSenhaHash(passwordEncoder.encode("admin123"));
        return funcionarioRepository.save(f);
    }

    private Animal animal(String nome, Especie especie, String raca, LocalDate nasc,
                          String peso, boolean vac, boolean cas, boolean ver, String obs, String foto) {
        Animal a = new Animal();
        a.setNome(nome); a.setEspecie(especie); a.setRaca(raca);
        a.setDtNascimento(nasc); a.setPeso(new BigDecimal(peso));
        a.setVacinado(vac); a.setCastrado(cas); a.setVermifugado(ver);
        a.setObservacoes(obs); a.setFotoUrl(foto);
        a.setStatus(StatusAnimal.DISPONIVEL);
        return animalRepository.save(a);
    }

    private Candidato candidato(String nome, String cpf, LocalDate nasc, String email,
                                String tel, String end, String moradia, boolean quintal,
                                boolean externo, boolean outros, boolean criancas,
                                String horas, boolean cerca, String desc,
                                StatusCandidato status, Long idAnimal, String nomeAnimal) {
        Candidato c = new Candidato();
        c.setNome(nome); c.setCpf(cpf); c.setDtNascimento(nasc);
        c.setEmail(email); c.setTelefone(tel); c.setEndereco(end);
        c.setTipoMoradia(moradia); c.setPossuiQuintal(quintal);
        c.setPossuiEspacoExterno(externo); c.setTemOutrosAnimais(outros);
        c.setCriancasEmCasa(criancas); c.setHorasEmCasaPorDia(horas);
        c.setTemCercaOuTela(cerca); c.setDescricaoAmbiente(desc);
        c.setStatus(status);
        c.setIdAnimalDesejado(idAnimal);
        c.setNomeAnimalDesejado(nomeAnimal);
        return candidatoRepository.save(c);
    }

    private void adocao(Candidato c, Animal a, Funcionario f, LocalDate data, StatusAdocao status) {
        Adocao ad = new Adocao();
        ad.setCandidato(c); ad.setAnimal(a); ad.setFuncionario(f);
        ad.setDataAdocao(data); ad.setStatus(status);
        adocaoRepository.save(ad);
    }
}
