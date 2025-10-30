package com.QuickCourier.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.QuickCourier.models.PesoModel;

@Repository
public interface  PesoRepository extends JpaRepository<PesoModel, Integer> {
        Optional<PesoModel> findByDescripcionPeso(String descripcionPeso);

    
}
