package br.com.tocadospeludos.repository;

import br.com.tocadospeludos.model.Animal;
import br.com.tocadospeludos.model.StatusAnimal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    long countByStatus(StatusAnimal status);
}
