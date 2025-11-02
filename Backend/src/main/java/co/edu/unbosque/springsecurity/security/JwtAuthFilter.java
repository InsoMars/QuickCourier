package co.edu.unbosque.springsecurity.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import co.edu.unbosque.springsecurity.model.Token;
import co.edu.unbosque.springsecurity.repository.TokenRepository;
import io.jsonwebtoken.ExpiredJwtException; 
import io.jsonwebtoken.MalformedJwtException; 
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // 1. Permite el paso a rutas públicas sin verificación de token
        if (path.startsWith("/auth")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")
                || path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Leer el token de la cabecera Authorization
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        // 2. Si no hay header o no tiene el formato 'Bearer ', no procesamos.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer el JWT después del prefijo "Bearer "
        final String jwtToken = authHeader.substring(7);
        final String correoUsuario;

        // MEJORA DEFENISVA: Prevenir el error de "Invalid compact JWT string"
        // si el token extraído está vacío o es demasiado corto después del "Bearer ".
        // Un JWT válido es mucho más largo que 10 caracteres.
        if (jwtToken.isEmpty() || jwtToken.length() < 10) { 
            System.err.println("Advertencia: Token JWT en cabecera es nulo o incompleto.");
            filterChain.doFilter(request, response);
            return;
        }


        try {
            // 3. Intenta extraer el correo del token.
            correoUsuario = jwtService.extraerCorreo(jwtToken);
        } catch (MalformedJwtException | ExpiredJwtException e) {
            // 4. Si el token está mal formado o expirado:
            // Simplemente no autenticamos y dejamos que el resto de Spring Security 
            // rechace la petición a un recurso protegido.
            System.err.println("Error de token JWT (Malformed o Expired): " + e.getMessage());
            filterChain.doFilter(request, response);
            return; 
        }

        // 5. Si el token es válido y no hay autenticación previa en el contexto
        if (correoUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 6. Verificar si el token existe en la base de datos y no está revocado/expirado
            // ESTA ES LA LÓGICA DE REVOCACIÓN / BLACKLISTING DE TOKENS.
            Token token = tokenRepository.findByToken(jwtToken).orElse(null);
            
            if (token == null || token.isExpirado() || token.isRevocado()) {
                 filterChain.doFilter(request, response);
                 return; // Token encontrado pero inválido en DB.
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(correoUsuario);
            
            // 7. Si el token es válido contra el servicio (firma) y la base de datos, autenticar
            if (jwtService.esTokenValidoUsuariosDetalles(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 8. Continuar la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
