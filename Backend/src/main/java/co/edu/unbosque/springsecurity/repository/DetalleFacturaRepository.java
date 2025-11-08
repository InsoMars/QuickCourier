package co.edu.unbosque.springsecurity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.DetalleFacturaProducto;


@Repository
public interface DetalleFacturaRepository extends JpaRepository<DetalleFacturaProducto, Long> {
    
}
