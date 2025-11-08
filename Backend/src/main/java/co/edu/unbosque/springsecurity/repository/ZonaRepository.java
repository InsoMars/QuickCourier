package co.edu.unbosque.springsecurity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.Zona;


@Repository
public interface  ZonaRepository extends JpaRepository<Zona, Long> {

@Query("SELECT z FROM Zona z WHERE LOWER(z.nombreZona) = LOWER(:nombreZona)")
Optional<Zona> findByNombreZonaIgnoreCase(@Param("nombreZona") String nombreZona);


    
    
}
