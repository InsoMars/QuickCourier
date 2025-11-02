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

        if (path.startsWith("/auth")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")
                || path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String correoUsuario;

       
        if (jwtToken.isEmpty() || jwtToken.length() < 10) { 
            System.err.println("Advertencia: Token JWT en cabecera es nulo o incompleto.");
            filterChain.doFilter(request, response);
            return;
        }


        try {
            correoUsuario = jwtService.extraerCorreo(jwtToken);
        } catch (MalformedJwtException | ExpiredJwtException e) {
            
            System.err.println("Error de token JWT (Malformed o Expired): " + e.getMessage());
            filterChain.doFilter(request, response);
            return; 
        }

        if (correoUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
          
            Token token = tokenRepository.findByToken(jwtToken).orElse(null);
            
            if (token == null || token.isExpirado() || token.isRevocado()) {
                 filterChain.doFilter(request, response);
                 return;
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(correoUsuario);
            
            if (jwtService.esTokenValidoUsuariosDetalles(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
