package co.edu.unbosque.springsecurity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.DetalleExtra;
import co.edu.unbosque.springsecurity.model.Factura;

@Repository
public interface DetalleExtraRepository extends JpaRepository<DetalleExtra, Long> {
    List<DetalleExtra> findByFactura(Factura factura);
}
