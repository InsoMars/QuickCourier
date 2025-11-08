package co.edu.unbosque.springsecurity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.DetalleExtra;

@Repository
public interface DetalleExtraRepository extends JpaRepository<DetalleExtra, Long> {
    
}
