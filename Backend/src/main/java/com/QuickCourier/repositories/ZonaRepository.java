package com.QuickCourier.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.QuickCourier.models.ZonaModel;


@Repository
public interface ZonaRepository extends  JpaRepository<ZonaModel, Integer> {

        Optional<ZonaModel> findByNombreZona(String nombreZona);

    
}
