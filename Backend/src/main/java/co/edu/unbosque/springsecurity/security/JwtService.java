package co.edu.unbosque.springsecurity.security;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import co.edu.unbosque.springsecurity.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String claveSecreta;

    @Value("${application.security.jwt.expiration}")
    private long expiracionJwt;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long expiracionRefresh;

  
    public String generarToken(final Usuario usuario) {
        return construirToken(usuario, expiracionJwt);
    }


    public String generarRefreshToken(final Usuario usuario) {
        return construirToken(usuario, expiracionRefresh);
    }

 
    private String construirToken(final Usuario usuario, final long expiracion) {
        return Jwts.builder()
                .id(usuario.getId().toString())
                .claims(Map.of(
                        "nombre", usuario.getNombreCompleto(),
                        "correo", usuario.getCorreoElectronico(),
                        "rol", usuario.getRol()
                ))
                .subject(usuario.getCorreoElectronico())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiracion))
                .signWith(obtenerClaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey obtenerClaveFirma() {
        byte[] bytesClave = Decoders.BASE64.decode(claveSecreta);
        return Keys.hmacShaKeyFor(bytesClave);
    }

   
    public String extraerCorreo(final String token) {
        Claims datosJwt = obtenerClaims(token);
        return datosJwt.getSubject();
    }

  
    private Claims obtenerClaims(final String token) {
        Jws<Claims> jwt = Jwts.parser()
                .verifyWith(obtenerClaveFirma())
                .build()
                .parseSignedClaims(token);
        return jwt.getPayload();
    }

    public boolean esTokenValido(final String token, final Usuario usuario) {
        String correoExtraido = extraerCorreo(token);
        return (correoExtraido.equals(usuario.getCorreoElectronico()) && !estaExpirado(token));
    }

    public boolean esTokenValidoUsuariosDetalles(final String token, final UserDetails userDetails) {
        String correoExtraido = extraerCorreo(token);
        return (correoExtraido.equals(userDetails.getUsername()) && !estaExpirado(token));
    }

    
    private boolean estaExpirado(final String token) {
        return obtenerFechaExpiracion(token).before(new Date());
    }

    
    private Date obtenerFechaExpiracion(final String token) {
        return obtenerClaims(token).getExpiration();
    }

}
