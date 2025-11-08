package co.edu.unbosque.springsecurity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.Extra;


@Repository
public interface  ExtraEnvioRepository extends JpaRepository<Extra, Long> {

Optional<Extra> findByCodigoExtraIgnoreCase(String codigoExtra);
    
}
