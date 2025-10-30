package co.edu.unbosque.springsecurity.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.springsecurity.dto.LoginDTO;
import co.edu.unbosque.springsecurity.dto.RegistroDTO;
import co.edu.unbosque.springsecurity.dto.TokenDTO;
import co.edu.unbosque.springsecurity.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para registro, login y refresco de tokens JWT")
public class UsuarioController {

    private final UsuarioService service;

    @Operation(
        summary = "Registrar un nuevo usuario",
        description = "Crea un nuevo usuario en el sistema y devuelve un token JWT válido."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario registrado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario existente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/register")
    public ResponseEntity<TokenDTO> register(@RequestBody RegistroDTO request) {
        TokenDTO token = service.registro(request);
        return ResponseEntity.ok(token);
    }

 
    @Operation(
        summary = "Iniciar sesión",
        description = "Valida las credenciales del usuario y devuelve un token JWT de autenticación."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
        @ApiResponse(responseCode = "401", description = "Credenciales incorrectas"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/login")
    public ResponseEntity<TokenDTO> authenticate(@RequestBody LoginDTO request) {
        TokenDTO token = service.login(request);
        return ResponseEntity.ok(token);
    }

  
    @Operation(
        summary = "Refrescar token JWT",
        description = "Recibe el token actual en el header Authorization y devuelve uno nuevo si aún es válido."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token refrescado correctamente"),
        @ApiResponse(responseCode = "401", description = "Token inválido o expirado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenDTO> refreshToken(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        TokenDTO token = service.refreshToken(authHeader);
        return ResponseEntity.ok(token);
    }
}
