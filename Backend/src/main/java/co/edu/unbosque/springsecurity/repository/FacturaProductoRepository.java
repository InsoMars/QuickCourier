package co.edu.unbosque.springsecurity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.Factura;



@Repository
public interface FacturaProductoRepository extends JpaRepository<Factura, Long> {
    @Query(value = "SELECT * FROM factura_producto ORDER BY id_num_fac_prod DESC LIMIT 1", nativeQuery = true)
    Optional<Factura> findUltimaFactura();
}
