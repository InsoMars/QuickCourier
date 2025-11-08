package co.edu.unbosque.springsecurity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.DetalleFacturaProducto;
import co.edu.unbosque.springsecurity.model.Factura;


@Repository
public interface DetalleFacturaRepository extends JpaRepository<DetalleFacturaProducto, Long> {
    List<DetalleFacturaProducto> findByFactura(Factura factura);
}
