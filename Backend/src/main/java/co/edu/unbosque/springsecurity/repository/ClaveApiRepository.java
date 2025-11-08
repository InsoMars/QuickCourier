package co.edu.unbosque.springsecurity.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import co.edu.unbosque.springsecurity.model.ClaveApi;

@Repository
public interface ClaveApiRepository extends JpaRepository<ClaveApi, Long> {
    Optional<ClaveApi> findByClave(String clave);
}
