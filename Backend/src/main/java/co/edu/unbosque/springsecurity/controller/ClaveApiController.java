package co.edu.unbosque.springsecurity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.ClaveApiDTO;
import co.edu.unbosque.springsecurity.service.ClaveApiService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/claves")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8080")
public class ClaveApiController {

    private final ClaveApiService claveApiService;

    @PostMapping("/crear")
    public ResponseEntity<ClaveApiDTO> crear(
            @RequestParam String propietario,
            @RequestParam(required = false) String descripcion) {

        ClaveApiDTO creada = claveApiService.crearClave(propietario, descripcion);
        return ResponseEntity.ok(creada);
    }

    @PostMapping("/revocar")
    public ResponseEntity<String> revocar(@RequestParam String clave) {
        claveApiService.revocarClave(clave);
        return ResponseEntity.ok("Clave revocada correctamente");
    }

    @GetMapping("/validar")
    public ResponseEntity<String> validar(@RequestParam String clave) {
        boolean valida = claveApiService.esClaveValida(clave);
        return valida
                ? ResponseEntity.ok("Clave válida")
                : ResponseEntity.status(401).body("Clave no válida o revocada");
    }
}
