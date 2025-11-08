package co.edu.unbosque.springsecurity.security;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket crearBucket() {
        Refill refill = Refill.greedy(4000, Duration.ofMinutes(1));
        Bandwidth limit = Bandwidth.classic(4000, refill);
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("[RATE-LIMIT] Entrando al filtro - URI: " + request.getRequestURI()
                + " - Principal: " + (SecurityContextHolder.getContext().getAuthentication() == null
                     ? "null" : SecurityContextHolder.getContext().getAuthentication().getName()));


  
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            filterChain.doFilter(request, response);
            return; 
        }

        String correoUsuario = authentication.getName();
        Bucket bucket = buckets.computeIfAbsent(correoUsuario, k -> crearBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Rate limit excedido para el usuario " + correoUsuario + "\"}");
        }
    }
}
