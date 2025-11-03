package co.edu.unbosque.springsecurity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.edu.unbosque.springsecurity.model.Producto;

@Repository
public interface  ProductoRepository extends JpaRepository<Producto, Long> {
    
}
