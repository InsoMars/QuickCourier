package co.edu.unbosque.springsecurity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import co.edu.unbosque.springsecurity.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    private final UsuarioRepository usuarioRepositorio;

   
    @Bean
    public UserDetailsService usuarioDetalleServicio() {
        return nombreUsuario -> usuarioRepositorio.findByEmail(nombreUsuario)
                .map(usuario -> org.springframework.security.core.userdetails.User
                        .builder()
                        .username(usuario.getEmail())
                        .password(usuario.getContrasena())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

   
    @Bean
    public AuthenticationProvider proveedorAutenticacion() {
        DaoAuthenticationProvider proveedor = new DaoAuthenticationProvider();
        proveedor.setUserDetailsService(usuarioDetalleServicio());
        proveedor.setPasswordEncoder(codificadorContrasenas());
        return proveedor;
    }

    
    @Bean
    public AuthenticationManager administradorAutenticacion(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

   
    @Bean
    public PasswordEncoder codificadorContrasenas() {
        return new BCryptPasswordEncoder();
    }
}
