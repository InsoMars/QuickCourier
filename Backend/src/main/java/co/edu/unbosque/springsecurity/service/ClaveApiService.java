package co.edu.unbosque.springsecurity.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import co.edu.unbosque.springsecurity.dto.ClaveApiDTO;
import co.edu.unbosque.springsecurity.model.ClaveApi;
import co.edu.unbosque.springsecurity.repository.ClaveApiRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaveApiService {

    private final ClaveApiRepository repositorio;

    // Crear una nueva API Key
    public ClaveApiDTO crearClave(String propietario, String descripcion) {
        String nuevaClave = UUID.randomUUID().toString();

        ClaveApi claveApi = ClaveApi.builder()
                .clave(nuevaClave)
                .propietario(propietario)
                .descripcion(descripcion)
                .revocada(false)
                .fechaCreacion(LocalDateTime.now())
                .build();

        ClaveApi guardada = repositorio.save(claveApi);

        return ClaveApiDTO.builder()
                .id(guardada.getId())
                .clave(guardada.getClave())
                .propietario(guardada.getPropietario())
                .descripcion(guardada.getDescripcion())
                .revocada(guardada.isRevocada())
                .fechaCreacion(guardada.getFechaCreacion())
                .build();
    }

    // Revocar una API Key existente
    public void revocarClave(String clave) {
        ClaveApi claveApi = repositorio.findByClave(clave)
                .orElseThrow(() -> new IllegalArgumentException("Clave no encontrada"));

        claveApi.setRevocada(true);
        repositorio.save(claveApi);
    }

    // Validar si una API Key es válida
    public boolean esClaveValida(String clave) {
        return repositorio.findByClave(clave)
                .filter(c -> !c.isRevocada())
                .isPresent();
    }
}
