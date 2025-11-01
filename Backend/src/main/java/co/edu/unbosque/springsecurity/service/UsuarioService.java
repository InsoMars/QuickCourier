package co.edu.unbosque.springsecurity.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.dto.LoginDTO;
import co.edu.unbosque.springsecurity.dto.RegistroDTO;
import co.edu.unbosque.springsecurity.dto.TokenDTO;
import co.edu.unbosque.springsecurity.model.Cliente;
import co.edu.unbosque.springsecurity.repository.UsuarioRepository;
import co.edu.unbosque.springsecurity.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public TokenDTO registro(RegistroDTO request) {

        var usuario = Cliente.builder()
                .nombre(request.getNombreCompleto())
                .email(request.getCorreoElectronico())
                .cedula(request.getCedula())
                .direccion(request.getDireccion())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono())
                .build();

        var usuarioGuardado = usuarioRepository.save(usuario);

        var jwtToken = jwtService.generarToken(usuarioGuardado);
        var refreshToken = jwtService.generarRefreshToken(usuarioGuardado);

        tokenService.guardarToken(usuarioGuardado, jwtToken);

        return new TokenDTO(jwtToken, refreshToken);
    }

    public TokenDTO login(LoginDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreoElectronico(),
                        request.getContrasena()
                )
        );

        var usuario = usuarioRepository.findByEmail(request.getCorreoElectronico())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        var jwtToken = jwtService.generarToken(usuario);
        var refreshToken = jwtService.generarRefreshToken(usuario);

        tokenService.revocarTokens(usuario);
        tokenService.guardarToken(usuario, jwtToken);

        return new TokenDTO(jwtToken, refreshToken);
    }

    public TokenDTO refreshToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token Bearer inválido");
        }

        var refreshToken = authHeader.substring(7);
        var userEmail = jwtService.extraerCorreo(refreshToken);

        if (userEmail == null) {
            throw new IllegalArgumentException("Token de refresco inválido");
        }

        var usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!jwtService.esTokenValido(refreshToken, usuario)) {
            throw new IllegalArgumentException("Token de refresco inválido o expirado");
        }

        var nuevoAccessToken = jwtService.generarToken(usuario);
        tokenService.revocarTokens(usuario);
        tokenService.guardarToken(usuario, nuevoAccessToken);

        return new TokenDTO(nuevoAccessToken, refreshToken);
    }
}
