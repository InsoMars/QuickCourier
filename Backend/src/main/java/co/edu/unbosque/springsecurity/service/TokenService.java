package co.edu.unbosque.springsecurity.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.springsecurity.model.Token;
import co.edu.unbosque.springsecurity.model.TokenType;
import co.edu.unbosque.springsecurity.model.Usuario;
import co.edu.unbosque.springsecurity.repository.TokenRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    @Transactional
    public void guardarToken(Usuario usuario, String jwtToken) {
        var token = Token.builder()
                .usuario(usuario)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expirado(false)
                .revocado(false)
                .build();

        tokenRepository.save(token);
    }

    @Transactional
    public void revocarTokens(Usuario usuario) {
        List<Token> tokensValidos = tokenRepository.findAllValidTokensByUserId(usuario.getId());
        if (tokensValidos.isEmpty()) return;

        tokensValidos.forEach(token -> {
            token.setExpirado(true);
            token.setRevocado(true);
        });

        tokenRepository.saveAll(tokensValidos);
    }
}
